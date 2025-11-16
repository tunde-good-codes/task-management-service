require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const mongoose= require("mongoose");
const logger = require("./utils/logger");
const {RateLimiterRedis} = require("rate-limiter-flexible")
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const Redis = require("ioredis");
const authRoutes = require("./routes/AuthRoutes")
const PORT = process.env.PORT || 3001;
const errorHandler = require("./middleware/errorHandler");

// connected to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("connected to database");
  })
  .catch((e) => {
    logger.error("connection error : Mongodb");
  });

  const redisClient = new Redis(process.env.REDIS_URI);
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use((req, res,next)=>{
    logger.info(`Received ${req.method} request to ${req.url} `);
    logger.info(`Request body,  ${req.body} `);
    next();
  })


  
//DDos protection and rate limiting  -> more than 10 request per sec
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});

app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({ success: false, message: "Too many requests" });
    });
});



//Ip based rate limiting for sensitive endpoints
const sensitiveEndpointsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ success: false, message: "Too many requests" });
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});

//apply this sensitiveEndpointsLimiter to our routes
app.use("/api/auth/register", sensitiveEndpointsLimiter);

//http://localhost:3000/v1/auth/register
//Routes
app.use("/api/auth", authRoutes);

//error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`user service running on port ${PORT}`);
});

//unhandled promise rejection

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});
