const amqp = require('amqplib');
const config = require('../../utils/config/config');

const ProducerService = {
  sendMessage: async (queue, message) => {
    try {
      const connection = await amqp.connect(config.rabbitMq.server);
      const channel = await connection.createChannel();

      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(message));

      setTimeout(() => connection.close(), 1000);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },
};

module.exports = ProducerService;
