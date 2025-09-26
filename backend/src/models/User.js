import mongoose, { Mongoose } from "mongoose";


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePic: {
        type: String,
        default: ""
    },

}, { timestamps: true }  //created at and updated at
);

const User = mongoose.model("user", userSchema);


export default User;