import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String, 
        enum: ['superAdmin', 'subAdmin'], 
        default: 'subAdmin'
    },
    isLogin:{
        type: Boolean,
        default:false,
    }
})

export default mongoose.model('user',userSchema)
