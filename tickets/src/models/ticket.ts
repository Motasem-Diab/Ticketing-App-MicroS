
import mongoose from 'mongoose';

import { updateIfCurrentPlugin } from 'mongoose-update-if-current'; // to use it in concurrency issues chapter 19


// Describes the properties that is required to create a new user
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// Describes the properties that a Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

// Describes the properties that a Ticket document (like in DB) has
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;        // to use it in concurrency issues chapter 19
    orderId?: string;    // to know the status of your ticket
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
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
    return new Ticket(attrs)
}

// < type, type(retutn) > generic type arguments
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);


export { Ticket };