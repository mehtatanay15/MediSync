import mongoose from 'mongoose'


const notificationSchema = new mongoose.Schema({
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
        required:true
    },
    sent_at: {
        type: Date,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    // TODO: fileds status and type
},{timestamps:true})

const Notification=new mongoose.model('Notification', notificationSchema)

export default Notification


