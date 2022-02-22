import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.clear();
  console.log('listener connected to nats');

  // close connection to NATS immediately
  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// close connection to NATS whenever we get signal to shutdown
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
