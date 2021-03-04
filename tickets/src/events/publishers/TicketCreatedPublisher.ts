
import { Publisher, Subjects, TicketCreatedEvent } from '@e-commerce-social-media/common' ;

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

    
}