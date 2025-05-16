import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";
import Patient from "../models/patient.model.js";

const register = async (req, res) => {
    try {
        const {user, experience, consultation_fees, gender, dob, specialization_status, phone} = req.body;

        const existingUser = await User.findById(user);
        if (!existingUser || existingUser.role !== "Doctor") {
            return res.status(400).json({ error: "Invalid user / Role must be 'Doctor'"});
        }

        const existingDoctor = await Doctor.findOne({user});
        if(existingDoctor){
            return res.status(400).json({error: "Doctor profile already created"});
        }

        const doctor = new Doctor(req.body);

        await doctor.save();
        res.status(201).json({ message: "Doctor profile created", doctor});
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .populate('user', 'name email')
            .populate('patients', 'name age gender');
        res.json(doctors);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const getMyProfile = async (req, res) => {
    try {

        const user = req.user;
        const doctor = await Doctor.findOne({ user: user._id })
            .populate('patients', 'name age gender')
            .populate({
                path: 'prescriptions',
                populate: { path: 'patient', select: 'name age gender' }
            }).populate('user','name email');
        
        if (!doctor) {
            return res.status(404).json({ error: "Doctor profile not found" });
        }
        
        res.json(doctor);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id)
            .populate('user', 'name email')
            .populate('patients', 'name age gender')
            .populate({
                path: 'prescriptions',
                populate: { path: 'patient', select: 'name age gender' }
            });
        
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        
        res.json(doctor);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const doctor = await Doctor.findOne({ user: user._id });
        if (!doctor) {
            return res.status(404).json({ error: "Doctor profile not found" });
        }
        if (req.body.user) {
            delete req.body.user;
        }
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            doctor._id,
            req.body,
            { new: true, runValidators: true }
        ).populate('user', 'name email')
         .populate('patients', 'name age gender');  
        
        res.json({ message: "Profile updated successfully", doctor: updatedDoctor });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const user = req.user;
        const doctor = await Doctor.findOne({ user: user._id });
        if (!doctor) {
            return res.status(404).json({ error: "Doctor profile not found" });
        }
        await Promise.all(doctor.patients.map(async (patientId) => {
            await Patient.findByIdAndUpdate(patientId, {
                $pull: { doctors: doctor._id }
            });
        }));

        await Doctor.findByIdAndDelete(doctor._id);
        
        res.json({ message: "Doctor profile deleted successfully" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const getMyPatients = async (req, res) => {
    try {
        //console.log('IN CONTROLLER')
        const user = req.user;
        const doctor = await Doctor.findOne({ user: user._id });
        if (!doctor) {
            return res.status(404).json({ error: "Doctor profile not found" });
        }
        const patients = await Patient.find({ 
            doctors: doctor._id 
        });
        console.log(patients)
        res.json(patients);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const getPatientById = async (req, res) => {
    try {
        const user = req.user;
        const doctor = await Doctor.findOne({ user: user._id });
        if (!doctor) 
            return res.status(404).json({ error: "Doctor profile not found" });

        const { id } = req.params;
        const patient = await Patient.findById(id).populate('doctors', 'user');

        if (!patient) return res.status(404).json({ error: "Patient not found" });

        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getDoctorsBySpecialization = async (req, res) => {
    try {
        const { specialization } = req.query;

        if (!specialization) {
            return res.status(400).json({ error: "Specialization query is required" });
        }

        const doctors = await Doctor.find({ specialization: specialization })
            .populate('user', 'name email')
            .populate('patients', 'name age gender');

        res.json(doctors);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const getDoctorsByClinicAddress= async (req, res) => {
    try {
        const { clinic_address } = req.query;

        if (!clinic_address) {
            return res.status(400).json({ error: "Clinic address query is required" });
        }

        const doctors = await Doctor.find({ clinic_address: clinic_address })
            .populate('user', 'name email')
            .populate('patients', 'name age gender');

        res.json(doctors);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};



export default {
    register,
    getMyProfile,
    getDoctorById,
    getAllDoctors,
    updateProfile,
    deleteProfile,
    getMyPatients,
    getPatientById,
    getDoctorsBySpecialization,
	getDoctorsByClinicAddress
};
