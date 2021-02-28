import request from 'supertest';
import { app } from '../../app';

it('has a route handler listening to /api/tickets for POST requests', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('Can only be accessed if the user is singed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});
    expect(response.status).toEqual(401);
});

it('Return status other that 401 if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({});
    expect(response.status).not.toEqual(401);
});

it('Returns an error if an invalid title is porvided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 1
        })
        .expect(400);
    
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            price: 1
        })
        .expect(400);
});

it('Returns an error if an invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'ticket1',
            price: -1
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'ticket1'
        })
        .expect(400);
});

it('Creates a ticket with valid inputs', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'ticket1',
            price: 1
        })
        .expect(201);
});