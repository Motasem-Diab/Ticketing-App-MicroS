import { Publisher, OrderCancelledEvent, Subjects } from '@e-commerce-social-media/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}