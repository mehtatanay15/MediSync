import { timeStamp } from 'console'
import mongoose from 'mongoose'

const clinicSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    unique_initials: {
        type: String,
        required: true
    },
    doctor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        // required: true
    }],
    capacity: {
        type: Number,
        required: true
    },
    latest_available_date: {
        type: Date,
        required: true
    },
    isopen: {
        type: Boolean,
        required: true
    },
    opens_at: {
        type: String,
        required: true
    },
    closes_at: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    contact:{
        type: String,
    },

}, { timestamps: true })

const Clinic = new mongoose.model('Clinic', clinicSchema)

export default Clinic
