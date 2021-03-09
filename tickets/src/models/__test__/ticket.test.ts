import { Ticket } from '../ticket';

it('implements optimistic concurrency control ', async (done) => { // for try catch
    // Create an instance of ticket
    const ticket = Ticket.build({
        title: 'title1',
        price: 4,
        userId: '123'
    });

    // Save the ticke in DB
    await ticket.save();

    // fetch the ticket twice
    const firtsInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make a seperate changes to the tickets we fetched
    firtsInstance!.set({ price: 10});
    secondInstance!.set({ price: 15});

    // save the first fetched ticket
    await firtsInstance!.save();

    // save the second fetched ticket (will fail)
    // await secondInstance!.save();
    // expect( async ()=> {
    //     await secondInstance!.save();
    // }).toThrow();
    try {
        await secondInstance!.save();
    } catch (error) {
        return done();
    }
    throw new Error('Should not reach this point');
});


it('increament the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'title1',
        price: 4,
        userId: '123'
    });
    await ticket.save();
    
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
});