import mongoose from 'mongoose'

const medicalTestSchema=new mongoose.Schema({
    
    test_name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    center:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'TestCentre',
        required:true
    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true
    }
},{timestamps:true}) 

const MedicalTest=new mongoose.model('MedicalTest', medicalTestSchema)

export default MedicalTest
