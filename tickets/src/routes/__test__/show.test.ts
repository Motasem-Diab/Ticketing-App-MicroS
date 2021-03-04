import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';


// jest.mock('../../nats-wrapper');  // Make a fake NATS client to pass the tests

it('Returns 404 if the ticket is not found', async() => {
    const id = mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .get(`/api/tickets/${id}`)
        .send({});
    expect(response.status).toEqual(404);
})

it('Returns the ticket if the ticket is found', async() => {
    
    // // We can use this way
    // Ticket.build({});
    // await ticket.save()

    const title = 'ticket1';
    const price = 1;
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price
        })
        .expect(201)
    // console.log(response.body[0].id);
    const tickeResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);
    expect(tickeResponse.body.title).toEqual(title);
    expect(tickeResponse.body.price).toEqual(price);
    
})