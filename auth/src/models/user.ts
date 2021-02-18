
import mongoose, { Mongoose } from 'mongoose';

import { Password } from '../services/Password';

// Describes the properties that is required to create a new user
interface UserAttrs {
    email: string ;
    password: string ;
}

// Describes the properties that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// Describes the properties that a User document (like in DB) has
interface UserDoc extends mongoose.Document {
    email: string ;
    password: string ;
    // createdAt: Date
}

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required: true
    }
});

// A middleware function implemented in mongoose
userSchema.pre('save', async function(done) {
    if( this.isModified('password')){ // even if created new
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();     // like next
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

// < type, type(retutn) > generic type arguments
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// Trick for TS
// const buildUser = (attrs: UserAttrs)=> {
//     return new User(attrs)
// };

export { User };