import Clinic from "../models/clinic.model.js";

export const createClinic = async (req, res) => {
    try {
        const user = req.user._id
        const clinic = new Clinic({user, ...req.body});
        await clinic.save();
        return res.status(201).json({ success: true, data: clinic });
    } catch (error) {
        console.error("Error creating clinic:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const readAllClinics = async (req, res) => {
    try {
        const clinics = await Clinic.find().populate("doctor");
        return res.status(200).json({ success: true, data: clinics });
    } catch (error) {
        console.error("Error fetching clinics:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const readClinicById = async (req, res) => {
    try {
        const clinic = await Clinic.findById(req.params.id).populate("doctor");
        if (!clinic) {
            return res.status(404).json({ success: false, message: "Clinic not found" });
        }
        return res.status(200).json({ success: true, data: clinic });
    } catch (error) {
        console.error("Error fetching clinic by ID:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateClinic = async (req, res) => {
    try {
        const clinic = await Clinic.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate("doctor");

        if (!clinic) {
            return res.status(404).json({ success: false, message: "Clinic not found" });
        }

        return res.status(200).json({ success: true, data: clinic });
    } catch (error) {
        console.error("Error updating clinic:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteClinic = async (req, res) => {
    try {
        const clinic = await Clinic.findByIdAndDelete(req.params.id);
        if (!clinic) {
            return res.status(404).json({ success: false, message: "Clinic not found" });
        }
        return res.status(200).json({ success: true, message: "Clinic deleted successfully", data: clinic });
    } catch (error) {
        console.error("Error deleting clinic:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const addDoctorToMyClinic = async (req, res) => {
    try {
        const { doctorId } = req.body;
        const clinic = await Clinic.findOne({ user: req.user._id });

        if (!clinic) {
            return res.status(404).json({ success: false, message: "Clinic not found for this user" });
        }

        if (clinic.doctor.includes(doctorId)) {
            return res.status(400).json({ success: false, message: "Doctor already added" });
        }

        clinic.doctor.push(doctorId);
        await clinic.save();

        const populatedClinic = await Clinic.findById(clinic._id)
        .populate('doctor')

        return res.status(200).json({ success: true, message: "Doctor added", populatedClinic });

    } catch (error) {
        console.error("Error adding doctor:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const searchClinics = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ success: false, message: "Search query is required" });
        }
        const regex = new RegExp(query, 'i'); // making it case insensitive
        const clinics = await Clinic.find({
            $or: [
                { name: { $regex: regex } },
                { location: { $regex: regex } }
            ]
        }).populate("doctor");

        return res.status(200).json({ success: true, data: clinics });

    } catch (error) {
        console.error("Error searching clinics:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
