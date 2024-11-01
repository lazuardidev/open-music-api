require('dotenv').config();

const amqp = require('amqplib');
const Listener = require('./listener');
const MailSender = require('./MailSender');
const PlaylistsService = require('./PlaylistsService');

const init = async () => {
  try {
    const mailSender = new MailSender();
    const playlistsService = new PlaylistsService();
    const listener = new Listener(playlistsService, mailSender);

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue('export:playlists', {
      durable: true,
    });

    channel.consume('export:playlists', listener.listen, { noAck: true });
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
};

init();
