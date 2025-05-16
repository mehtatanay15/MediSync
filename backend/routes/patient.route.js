import express from "express";
import {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    getAllPrescriptions,
    getMyProfile,
    updateProfile,
    deleteProfile
} from "../controllers/patient.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/profile",auth(["Patient"]),getMyProfile)
router.put("/profile",auth(["Patient"]),updateProfile)
router.delete("/profile", auth(["Patient"]), deleteProfile);
router.post("/profile", auth(["Patient"]),createPatient);
router.get("/", getAllPatients);
router.get("/:id", getPatientById);
router.put("/:id", auth(["Patient"]), updatePatient);
router.delete("/:id", auth(["Patient"]), deletePatient);
router.get("/get-all-prescriptions/:id", auth(["Patient","Clinic","Doctor"]),getAllPrescriptions);

export default router;

