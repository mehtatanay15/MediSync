import express from "express";
import doctorController from "../controllers/doctor.controller.js";
import auth from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register",auth(["Doctor"]),doctorController.register);
router.get("/profile", auth(["Doctor"]), doctorController.getMyProfile);
router.get("/", auth(["Doctor", "Clinic","Patient"]), doctorController.getAllDoctors);
router.put("/profile", auth(["Doctor"]), doctorController.updateProfile);
router.delete("/profile", auth(["Doctor"]), doctorController.deleteProfile);
router.get("/profile/patients", auth(["Doctor"]), doctorController.getMyPatients);
router.get('/getPatient/:id', auth(["Doctor"]), doctorController.getPatientById);
//router.get("/:id", auth(["Doctor", "Clinic"]), doctorController.getDoctorById);
router.get("/by-specialization", auth(["Doctor", "Clinic", "Patient"]), doctorController.getDoctorsBySpecialization);
router.get("/by-clinicAddress", auth(["Doctor", "Clinic", "Patient"]), doctorController.getDoctorsByClinicAddress);

export default router;


