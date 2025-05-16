import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    token_number: {
        type: Number,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
    estimated_waiting_time: {
        type: Number, // number of minutes
        required: true
    },
    clinic_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Clinic",
        required:true,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

// Ensure token_number resets per clinic daily
tokenSchema.pre('save', async function (next) {
    if (!this.isNew) return next(); // Skip for updates

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    // Get today's last token for this clinic
    const lastToken = await mongoose.model('Token').findOne({
        clinic_id: this.clinic_id,
        created_at: { $gte: today }
    }).sort({ token_number: -1 });

    this.token_number = lastToken ? lastToken.token_number + 1 : 1;
    next();
});

const Token = mongoose.model('Token', TokenSchema);
export default Token;