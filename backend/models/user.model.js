import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        // required:true,
    },
    email: {
        type: String,
        validate: {
            validator: validator.isEmail,
            message: (props) => `${props.value} is not a valid email!`
        },
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["Patient","Doctor","Clinic"],
    },
},{timestamps:true});

const User = mongoose.model('User', userSchema);

export default User;