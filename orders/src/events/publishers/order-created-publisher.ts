import { Publisher, OrderCreatedEvent, Subjects } from '@e-commerce-social-media/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}