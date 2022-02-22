import {
  OrderCancelledEvent,
  Subjects,
  Publisher,
} from '@[NPM_ORGANIZATION_NAME]/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
