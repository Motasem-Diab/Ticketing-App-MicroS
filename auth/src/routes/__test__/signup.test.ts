
import request from 'supertest';
import { app } from '../../app';

it(' return 201 on successful singup', async ()=> {
    return request(app)     // return or await
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
})


it(' returns 400 with invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@testcom',
            password: 'password'
        })
        .expect(400);
});


it(' returns 400 with invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'a'
        })
        .expect(400);
});


it(' returns 400 with missing email or password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com'
        })
        .expect(400);
    
        await request(app)
        .post('/api/users/signup')
        .send({
            password: 'password'
        })
        .expect(400);
});


it('returns a 404 with duplicates emails', async () => {
    await request(app)     // return or await
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    return request(app)     // return or await
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(400);
});