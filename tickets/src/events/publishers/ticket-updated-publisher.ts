import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@[NPM_ORGANIZATION_NAME]/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
