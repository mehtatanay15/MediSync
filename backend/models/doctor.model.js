import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    name:{
        type: String,
        required: true,
    },
    experience:{
        type:Number,
        required:true,
    },
    consultation_fees:{
        type:Number,
        required:true,
    },
    // //What I am thinking is this field is dynamic and it should be used in the token model
    // availability_status:{
    //     type:String,
    //     enum:["Available","Not Available"],
    // },
    gender:{
        type:String,
        enum:["Male","Female","Prefer not say"]
    },
    dob:{
        type:Date,
    },
    specialization:{
        type:String,
    },
    phone:{
        type:String,
    },
    prescriptions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Prescription",
    }],
    patients:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Patient",
    }],
	clinic_address: {
		type: String
	}
},{timestamps:true});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
