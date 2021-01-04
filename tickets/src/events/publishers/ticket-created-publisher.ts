import { Publisher, Subjects, TicketCreatedEvent } from '@ww-ticketing/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}