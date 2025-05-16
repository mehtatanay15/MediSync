import mongoose from "mongoose";

const medicalHistorySchema = new mongoose.Schema({
    past_illness:{
        type:String,
        required:true,
    },
    vaccinations:{
        type:[String],
        required:true,
    },
    allergies:{
        type:[String],
        required:true,
    },
    genetic_conditions:{
        type:[String],
        required:true,
    },
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Patient",
        required:true,
    },
    clinic_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Clinic",
        required:true,
    },
    test_id:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"MedicalTest",
    }
},{timestamps:true});

const MedicalHistory = mongoose.model('MedicalHistory', medicalHistorySchema);

export default MedicalHistory;

