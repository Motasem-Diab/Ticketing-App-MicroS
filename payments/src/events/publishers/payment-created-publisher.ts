import { Publisher, PaymentCreatedEvent, Subjects } from '@e-commerce-social-media/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}