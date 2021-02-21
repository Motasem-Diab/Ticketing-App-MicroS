
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
});


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

it('sets a cookie after successful singup', async () => {
    const response = await request(app)     // return or await
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    expect(response.get('Set-Cookie')).toBeDefined();       // look at secure in app.ts
});

it('should return the object if signed up correctly', async () => {
    const user = {
        email: 'test@test.com',
        password: 'password'
    }
    const response = await request(app)     // return or await
        .post('/api/users/signup')
        .send(user)
        .expect(201);
    
    expect(response.body).toHaveProperty('email',user.email);
    expect(response.body).toHaveProperty('id');
});