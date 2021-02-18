
import mongoose from 'mongoose';

interface UserAttrs {
    email: string ;
    password: string ;
}

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

// Trick for TS
const buildUser = (attrs: UserAttrs)=> {
    return new User(attrs)
};

export { User };