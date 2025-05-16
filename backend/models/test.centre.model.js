import mongoose from "mongoose";

const testCentreSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        digital_report: {
            type: String
        },
        availability: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const TestCentre = mongoose.model("TestCentre", testCentreSchema);

export default TestCentre;

