const amqp = require("amqplib");
const logger = require("./logger");

let connection = null;
let channel = null;

const EXCHANGE_NAME = "task_created";

async function connectToRabbitMQ(retry=5, delay=3000) {
 
while(retry){
   try {
    connection = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false });
    logger.info("Connected to rabbit mq");
    return channel;
  } catch (e) {
    logger.error("Error connecting to rabbit mq", e);
    retry--;
    logger.error("error connecting to mq: " + retry);

    await new Promise(res => setTimeout(res, delay))
  }
}

}

async function publishEvent(routingKey, message) {  // routing key is unique identifier and message could be data
  if (!channel) {
    await connectToRabbitMQ();
  }

  channel.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(message))
  );
  logger.info(`Event published: ${routingKey}`);
}

module.exports = { connectToRabbitMQ, publishEvent };
