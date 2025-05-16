import mongoose from 'mongoose'
import Clinic from './clinic.model.js'

const appointmentSchema=new mongoose.Schema({
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
        required:true
    },
    patient_name:{
        type: String,
        required: true,
    }, 
    patient_age:{
        type: Number,
        required: true,
    }, 
    patient_gender:{
        type: String,
        enum:["Male","Female"],
        required: true,
    }, 
    patient_blood_group:{
        type: String,
        enum: [
            'A+', 'A-',
            'B+', 'B-',
            'AB+', 'AB-',
            'O+', 'O-',
        ],
    }, 
    patient_phone:{
        type: String,
        required: true,
    },
    patient_address:{
        type: String,
    },
    isForSelf:{
        type: Boolean,
        required: true,
    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true
    },
    clinic:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Clinic',
        // required:true
    },
    //Not sure if this is required
    // booking_id:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'Booking',
    //     required:true
    // },
    status:{
        type:String,
        enum:['Not Arrived', 'Queued', 'Ongoing', 'Completed'],
        default:'Not Arrived',
    },
    appointment_number: {
        type: Number,
    },
    appointment_token: {
        type: String,
    }, 
    preferred_date:{
        type:Date,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    remarks:{
        type:String
    },
    region:{
        type:String,
        required:true
    },
    payment_status:{
        type: String,
        enum: ["Not Paid", "Paid"],
        default: "Not Paid"
    }
    // consultation_status:{
    //     type:String,
    //     enum:['Ongoing','Delayed','Queued','Not_Arrived'],
    //     default:'Not_Arrived'
    // }
},{timestamps:true})


appointmentSchema.pre('save', async function(next) {
    const clinic = await Clinic.findOne({_id: this.clinic});
    if(!clinic) throw new Error("Clinic not found");

    const date = new Date(this.preferred_date);
    const day = String(date.getUTCDate()).padStart(2,'0');
    const month = String(date.getUTCMonth()+1).padStart(2,'0'); // +1 , since months are 0-based indexing
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`
    const appointment_token = clinic.unique_initials + "-" + formattedDate + "-" + this.appointment_number
    this.appointment_token = appointment_token
    
    next();
})
const Appointment=new mongoose.model('Appointment', appointmentSchema)

export default Appointment;
