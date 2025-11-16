// utils/rabbitmq.js
const amqp = require("amqplib");
const logger = require("./logger");

let connection = null;
let channel = null;

const EXCHANGE_NAME = "task_created";

async function connectToRabbitMQ(retry = 5, delay = 3000) {
  while (retry) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URI);
      channel = await connection.createChannel();
      await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false });
      logger.info("Connected to RabbitMQ");
      return channel;
    } catch (e) {
      retry--;
      logger.error(`RabbitMQ connection failed (${retry} retries left):`, e);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

async function publishEvent(routingKey, message) {
  if (!channel) await connectToRabbitMQ();
  channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(message)));
  logger.info(`Event published: ${routingKey}`);
}

async function consumeEvent(queueName, bindingKey, callback) {
  if (!channel) await connectToRabbitMQ();
  await channel.assertQueue(queueName, { durable: false });
  await channel.bindQueue(queueName, EXCHANGE_NAME, bindingKey);
  logger.info(`Listening for events on ${bindingKey}...`);

  channel.consume(queueName, async (msg) => {
    if (msg?.content) {
      const event = JSON.parse(msg.content.toString());
      await callback(event);
    }
    channel.ack(msg);
  });
}

module.exports = { connectToRabbitMQ, publishEvent, consumeEvent };
