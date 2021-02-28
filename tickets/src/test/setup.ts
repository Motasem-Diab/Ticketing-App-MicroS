
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

import jwt from 'jsonwebtoken';


declare global {
    namespace NodeJS {
        interface Global {
            signin() : string[]
        }
    }
}


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
global.signin =  () => {
    // We will made a fake jwt
    // Build a JWT payload. {id, email}
    const payload = {
        id: '67899876',
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