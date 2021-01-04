import { Publisher, Subjects, TicketUpdatedEvent } from '@ww-ticketing/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}