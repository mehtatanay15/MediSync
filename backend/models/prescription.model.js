import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    medicine:{
        type:String,
        required:true,
    },
    disease:{
        type:String,
        required:true,
    },
    remarks:{
        type:String,
        required:true,
    },
    // patient:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"Patient",
    //     required:true,
    // },
    // doctor:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"Doctor",
    //     required:true,
    // },
    medical_tests:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"MedicalTest",
    },
    appointment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Appointment",
        required:true,
    },
    pdf:{
        type: String,
    }
},{timestamps:true});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;

