import MedicalTest from "../models/medical.test.model.js";
//import TestCentre from '../models/test.centre.model.js'
export const createMedicalTest = async (req, res) => {
    try {
        const { test_name, description, price, center ,doctor} = req.body;
        console.log(req.body)
        if (!test_name || !description || !price || !center || !doctor) {
            return res.status(400).json({ message: "Missing required fields: test_name, description, price, centre" });
        }

        const medicalTest = new MedicalTest({ test_name, description, price, center,doctor });

        await medicalTest.save();
        res.status(201).json(medicalTest);
    } catch (error) {
        console.error("Error creating medical test:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const readAllTests = async (req, res) => {
    try {
        const medicalTests = await MedicalTest.find().populate("center doctor");
        res.status(200).json(medicalTests);
    } catch (error) {
        console.error("Error fetching medical tests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const readTestsById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Medical test ID is required" });
        }

        const medicalTest = await MedicalTest.findById(req.params.id).populate("center doctor");
        if (!medicalTest) {
            return res.status(404).json({ message: "Medical test not found" });
        }

        res.status(200).json(medicalTest);
    } catch (error) {
        console.error("Error fetching medical test by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateTest = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Medical test ID is required" });
        }

        const medicalTest = await MedicalTest.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("center doctor");
        if (!medicalTest) {
            return res.status(404).json({ message: "Medical test not found" });
        }

        res.status(200).json(medicalTest);
    } catch (error) {
        console.error("Error updating medical test:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteTest = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Medical test ID is required" });
        }

        const medicalTest = await MedicalTest.findByIdAndDelete(req.params.id);
        if (!medicalTest) {
            return res.status(404).json({ message: "Medical test not found" });
        }

        res.status(200).json({ message: "Medical test deleted successfully", medicalTest });
    } catch (error) {
        console.error("Error deleting medical test:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTestsByDoctorId = async (req, res) => {
    try {
        const { doctorId } = req.params;

        if (!doctorId) {
            return res.status(400).json({ message: "Doctor ID is required" });
        }

        const tests = await MedicalTest.find({ doctor: doctorId }).populate("center doctor");

        if (tests.length === 0) {
            return res.status(404).json({ message: "No tests found for this doctor" });
        }

        res.status(200).json(tests);
    } catch (error) {
        console.error("Error fetching tests by doctor ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
