import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Male","Female"],
        required: true,
    },
    blood_group: {
        type: String,
        enum: [
            'A+', 'A-',
            'B+', 'B-',
            'AB+', 'AB-',
            'O+', 'O-',
        ],
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    prescriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
    }],
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
    }],
    test_reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "TestCentre"
    }]
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;

