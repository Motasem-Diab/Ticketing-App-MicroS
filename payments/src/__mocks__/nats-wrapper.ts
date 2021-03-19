// Make a fake NATS client to make the tests pass

export const natsWrapper = {
    client: {
        // publish: (subject:string, data:string, callback: ()=> void) => {
        //     callback();
        // }

        // Make a mock function
        publish: jest.fn().mockImplementation( (subject:string, data:string, callback: ()=> void) => {
            callback();
        })
    }
};