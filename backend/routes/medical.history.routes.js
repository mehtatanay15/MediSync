import express from "express";
import {createMedicalHistory,getAllMedicalHistories,getMedicalHistoryById,updateMedicalHistory,deleteMedicalHistory,getMedicalHistoryByPatientId,getMedicalHistoryByTestId,getMedicalHistoryByClinicId
} from "../controllers/medical.history.controller.js";
import {auth} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", auth(["Doctor","Clinic"]),createMedicalHistory)
router.get("/readAll", getAllMedicalHistories)
router.get("/readById/:id", getMedicalHistoryById)
router.put("/update/:id", auth(["Doctor","Clinic","Patient"]),updateMedicalHistory)
router.delete("/delete/:id", auth(["Doctor","Clinic"]),deleteMedicalHistory)
router.get("/patient/:patientId", auth(["Patient"]),getMedicalHistoryByPatientId)
router.get("/test/:testId", getMedicalHistoryByTestId)
router.get("/clinic/:clinicId", auth(["Clinic"]),getMedicalHistoryByClinicId)

export default router;
