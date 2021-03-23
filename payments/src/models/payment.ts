
import mongoose from 'mongoose';
import { OrderStatus } from '@e-commerce-social-media/common';

// to use it in concurrency issues chapter 19
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// Describes the properties that is required to create a new Payment
interface PaymentAttrs {
    orderId: string;
    stripeId: string;
}

// Describes the properties that a Payment model has
interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
}

// Describes the properties that a Payment document (like in DB) has
interface PaymentDoc extends mongoose.Document {
    orderId: string;
    stripeId: string;
    // version: number;     // we can do it   // to use it in concurrency issues chapter 19
}

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        required: true
    },
}, {
    toJSON: {   // It's invoked when trying to send, transform the doc to a JSON object 
        // many properties can you do here
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});


// Build the ticket by this to allow TS to do some validation
paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
}

// < type, type(retutn) > generic type arguments
const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };