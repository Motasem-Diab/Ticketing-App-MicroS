
// import { OrderStatus } from '@e-commerce-social-media/common';
import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// to use it in concurrency issues chapter 19
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


// Describes the properties that is required to create a new user
interface TicketAttrs {
    id: string;         // for data consistancy between services (Look at build method)
    title: string;
    price: number;
    // userId: string;
}

// Describes the properties that a Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

// Describes the properties that a Ticket document (like in DB) has
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;            // to use it in concurrency issues chapter 19
    isReserved(): Promise<boolean>;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {   // It's invoked when trying to send, transform the doc to a JSON object 
        // many properties can you do here
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

// to use it in concurrency issues chapter 19
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);


// Build the ticket by this to allow TS to do some validation
ticketSchema.statics.build = (attrs: TicketAttrs) => {

    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    })
}

ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this as TicketDoc,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })
    return !!existingOrder;
}

// < type, type(retutn) > generic type arguments
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);


export { Ticket };