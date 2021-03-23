
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

import jwt from 'jsonwebtoken';


declare global {
    namespace NodeJS {
        interface Global {
            signin(id?:string) : string[]
        }
    }
}


jest.mock('../nats-wrapper');  // Make a fake NATS client to pass the tests


// Method #2 of testing stripe
process.env.STRIPE_KEY = 'sk_test_51IXCDCHWW4djhLD2rtJeZuMFtP8QALuBNEBQatxqgTUSkYptIr9aDQ2nLas6wcmKvqcKCGSh0xVoptIeDII0cjq400NN0XSaMV';


let mongo: any ;
beforeAll( async ()=> {

    process.env.JWT_KEY = 'random';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach( async () => {

    jest.clearAllMocks(); // Testing mock event publisher

    const collections = await mongoose.connection.db.collections() ;

    for( let collection of collections){
        await collection.deleteMany( {} );
    }
});

afterAll( async () => {
    await mongo.stop();
    await mongoose.connection.close();
});


// Or make it in a seperate file and export it as regular
global.signin =  (id?:string) => {
    // We will made a fake jwt
    // Build a JWT payload. {id, email}

    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(), // only to make it random
        email: 'test@test.com'
    }

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!) ;

    // Build the session object {JWT: MY_JWT}
    const session = { jwt: token};

    // Turn that session into json
    const sessionJSON = JSON.stringify(session);

    // Take json and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // Return a string thats the cookie with the encoded data
    return [`express:sess=${base64}`];
}