import MedicalHistory from "../models/medical.history.model.js";

export const createMedicalHistory = async (req, res) => {
    try {
        const medicalHistory = new MedicalHistory(req.body)
        await medicalHistory.save()
        return res.status(201).json(medicalHistory)
    } catch (error) {
        console.error("Error creating medical history:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getAllMedicalHistories = async (req, res) => {
    try {
        const histories = await MedicalHistory.find().populate("patient clinic_id test_id")
        return res.status(200).json(histories)
    } catch (error) {
        console.error("Error fetching medical histories:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getMedicalHistoryById = async (req, res) => {
    try {
        const history = await MedicalHistory.findById(req.params.id).populate("patient clinic_id test_id")
        if (!history) 
            return res.status(404).json({ message: "Medical history not found" })
        return res.status(200).json(history);
    } catch (error) {
        console.error("Error fetching medical history by ID:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const updateMedicalHistory = async (req, res) => {
    try {
        const updatedHistory = await MedicalHistory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .populate("patient clinic_id test_id")
        if (!updatedHistory) 
            return res.status(404).json({ message: "Medical history not found" })
        return res.status(200).json(updatedHistory)
    } catch (error) {
        console.error("Error updating medical history:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
};

export const deleteMedicalHistory = async (req, res) => {
    try {
        const deletedHistory = await MedicalHistory.findByIdAndDelete(req.params.id)
        if (!deletedHistory) 
            return res.status(404).json({ message: "Medical history not found" })
        return res.status(200).json({ message: "Medical history deleted successfully", deletedHistory })
    } catch (error) {
        console.error("Error deleting medical history:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getMedicalHistoryByPatientId = async (req, res) => {
    try {
        const histories = await MedicalHistory.find({ patient: req.user._id }).populate("clinic_id test_id")
        if (histories.length === 0) 
            return res.status(404).json({ message: "No medical histories found for this patient" })
        return res.status(200).json(histories);
    } catch (error) {
        console.error("Error fetching medical histories by patient ID:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
};

export const getMedicalHistoryByTestId = async (req, res) => {
    try {
        const histories = await MedicalHistory.find({ test_id: req.params.testId }).populate("patient clinic_id")
        if (histories.length === 0) 
            return res.status(404).json({ message: "No medical histories found for this test" })
        return res.status(200).json(histories)
    } catch (error) {
        console.error("Error fetching medical histories by test ID:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getMedicalHistoryByClinicId = async (req, res) => {
    try {
        const histories = await MedicalHistory.find({ clinic_id: req.user._id }).populate("patient test_id")
        if (histories.length === 0) return res.status(404).json({ message: "No medical histories found for this clinic" })
        return res.status(200).json(histories)
    } catch (error) {
        console.error("Error fetching medical histories by clinic ID:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}
