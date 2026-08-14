const mongoose = require('mongoose');

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
    ,
    avatar:{
        type : String
    },
    plan:{
        type : String,
        enum:["free", "pro", "enterprise"]
    },
    credits:{
        type: Number,
        default : 100,
        min:0
    }
    
}, { timestamps: true })


const User = mongoose.model('User', userSchema);