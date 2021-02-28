import request from 'supertest';
import { app } from '../../app';


const createTicket = (title:string, price: number) => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: title,
            price: price
        });
}

it('Can fetch a list of tickets', async () => {
    await createTicket('title1',1);
    await createTicket('title2',1);
    await createTicket('title3',1);

    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);
    console.log(response)
    expect(response.body.length).toEqual(3);
});