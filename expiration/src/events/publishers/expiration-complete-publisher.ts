import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@ww-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
