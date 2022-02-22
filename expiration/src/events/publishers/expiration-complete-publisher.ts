import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@[NPM_ORGANIZATION_NAME]/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
