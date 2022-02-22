import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@[NPM_ORGANIZATION_NAME]/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Complete });

    await order.save();

    // we should do an OrderUpdated event to let others know
    // but for demo, no one else using so we are avoiding

    msg.ack();
  }
}
