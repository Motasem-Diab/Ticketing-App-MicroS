import request from 'supertest';
import { app } from '../../app';

it('has a route handler listening to /api/tickets for POST requests', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

        expect(response.status).not.toEqual(404);
});

it('Can only be accessed if the user is singed in', async () => {

});

it('Returns an error if an invalid title is porvided', async () => {

});

it('Returns an error if an invalid price is provided', async () => {

});

it('Creates a ticket with valid inputs', async () => {

});