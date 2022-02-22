import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@[NPM_ORGANIZATION_NAME]/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
