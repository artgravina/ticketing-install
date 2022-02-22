import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
  try {
    console.log('Start expiration 1');
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error('NATS_CLIENT_ID must be defined');
    }
    if (!process.env.NATS_URL) {
      throw new Error('NATS_URL must be defined');
    }
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error('NATS_CLUSTER_ID must be defined');
    }

    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    // close connection to NATS immediately
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    // close connection to NATS whenever we get signal to shutdown
    process.on('SIGINT', () => {
      console.log('sigint');
      natsWrapper.client.close();
    });
    process.on('SIGTERM', () => {
      console.log('sigterm');
      natsWrapper.client.close();
    });

    new OrderCreatedListener(natsWrapper.client).listen();
    console.log('Expiration started!');
  } catch (error) {
    console.error(error);
  }
};

start();
