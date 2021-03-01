import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose'

it('returns 404 if provided id does not exist', async () => {
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'ticket1',
            price: 1
        })
        .expect(404);
});

it('returns 401 if the user not authenticated', async () => {
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'ticket1',
            price: 1
        })
        .expect(401);
});

it('returns 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'ticket1',
            price: 1
        });
    // console.log(response.body[0]);
    
    await request(app)
        .put(`/api/tickets/${response.body[0].id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'ticket1.1',
            price: 1
        })
        .expect(401)
});

it('returns 400 if the user provides an invalid title or price', async () => {

});

it('Updates the ticket provided valid inputs', async () => {

});