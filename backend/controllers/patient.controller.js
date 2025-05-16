import Patient from "../models/patient.model.js";

export const createPatient = async (req, res) => {
    try {
        const {  name, age, gender, blood_group, phone, address,doctors = [], test_reports = []  } = req.body;
        const user=req.user
        const newPatient = new Patient({ user, name, age, gender, blood_group, phone, address,doctors,test_reports });
        const savedPatient = await newPatient.save();
        res.status(201).json(savedPatient);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().populate('prescriptions doctors test_reports');
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id)
            .populate('prescriptions doctors test_reports');
        if (!patient) return res.status(404).json({ error: "Patient not found" });
        res.status(200).json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updatePatient = async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedPatient) return res.status(404).json({ error: "Patient not found" });
        res.status(200).json(updatedPatient);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deletePatient = async (req, res) => {
    try {
        const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
        if (!deletedPatient) return res.status(404).json({ error: "Patient not found" });
        res.status(200).json({ message: "Patient deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllPrescriptions = async (req, res) => {
    try {

        const patient = await Patient.findById(req.params.id).populate({
            path: "prescriptions",
            populate: { path: "doctor", select: "user specialization_status phone" }
        });

        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        res.json({ patient: patient.name, prescriptions: patient.prescriptions });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};  

export const getMyProfile = async (req, res) => {
    try {
        const patient = await Patient.findOne({ user: req.user._id })
        .populate('doctors')
        .populate('prescriptions')
        .populate('test_reports');
      
      if (!patient) 
        return res.status(404).json({ error: "Patient profile not found" });
  
      res.status(200).json(patient);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
export const updateProfile = async (req, res) => {
    try {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient) return res.status(404).json({ error: "Patient profile not found" });
  
      const updated = await Patient.findByIdAndUpdate(patient._id, req.body, {
        new: true,
        runValidators: true
      });
  
      res.status(200).json({ message: "Profile updated", patient: updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
export const deleteProfile = async (req, res) => {
    try {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient) return res.status(404).json({ error: "Patient profile not found" });
  
      await Patient.findByIdAndDelete(patient._id);
      res.json({ message: "Patient profile deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };