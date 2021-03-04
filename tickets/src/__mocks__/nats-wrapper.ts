// Make a fake NATS client to make the tests pass

export const natsWrapper = {
    client: {
        publish: (subject:string, data:string, callback: ()=> void) => {
            callback();
        }
    }
};