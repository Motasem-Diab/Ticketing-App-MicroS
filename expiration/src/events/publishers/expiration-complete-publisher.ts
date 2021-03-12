import { Publisher, ExpirationCompleteEvent, Subjects } from '@e-commerce-social-media/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}