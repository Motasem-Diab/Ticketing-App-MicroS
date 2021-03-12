
import Queue from 'bull';

// optional
interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});


// process the job
// job var wraps the returned data
expirationQueue.process( async(job) => {
    console.log('I want to to publish an expiration:complete event for orderId', job.data.orderId);
});


export { expirationQueue };