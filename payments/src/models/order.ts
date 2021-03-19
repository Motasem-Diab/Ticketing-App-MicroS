
import mongoose from 'mongoose';
import { OrderStatus } from '@e-commerce-social-media/common';

// to use it in concurrency issues chapter 19
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// Describes the properties that is required to create a new Order
interface OrderAttrs {
    id: string;
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
}

// Describes the properties that a Order model has
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

// Describes the properties that a Order document (like in DB) has
interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;        // to use it in concurrency issues chapter 19
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    price: {
        type: Number,
        required: true
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
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);


// Build the ticket by this to allow TS to do some validation
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status
    });
}

// < type, type(retutn) > generic type arguments
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);


export { Order };