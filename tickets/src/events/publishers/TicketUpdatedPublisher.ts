
import { Publisher, Subjects, TicketUpdatedEvent } from '@e-commerce-social-media/common' ;

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

    
}