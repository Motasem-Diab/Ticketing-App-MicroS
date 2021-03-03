import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
    subject: Subjects;
    data: any
}

export abstract class Publisher<T extends Event> {
    abstract subject: T['subject'];
    private client: Stan;

    constructor(client: Stan){
        this.client = client;
    }

    publish(data: T['data']): Promise<void>{
        // To make it Async and add "Promise<void>"
        return new Promise( (resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if(err){
                    return reject(err);
                }
                console.log('Event Published to a subject ', this.subject);
                resolve();
            });
        });

        // Without promise
        // this.client.publish(this.subject, JSON.stringify(data), () => {
        //     console.log('Event Published ..');
        // });
    }
}