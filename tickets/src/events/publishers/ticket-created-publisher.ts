import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@[NPM_ORGANIZATION_NAME]/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
