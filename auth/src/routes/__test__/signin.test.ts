
import request from 'supertest';
import { app } from '../../app';


it(' returns 400 when the email doesn\'t exitst ', async ()=> {
    await request(app)     // return or await
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});


it('fails when the password is invalid', async () => {
    await request(app)     // return or await
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'incorrect password'
        })
        .expect(400);
})


it('responds with a cookie when given valid credintials', async () => {
    await request(app)     // return or await
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200);
    
    expect(response.get('Set-Cookie')).toBeDefined();
})