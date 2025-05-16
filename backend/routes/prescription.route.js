import express from "express";
import prescriptionController from "../controllers/prescription.controller.js";
import {auth} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/create/:appointmentId',auth(["Doctor"]),prescriptionController.create);
router.get('/get',prescriptionController.getAll);
router.get('/get/:id',prescriptionController.getById);
router.put('/update/:id',auth(["Doctor"]),prescriptionController.update);
router.delete('/delete/:id',auth(["Doctor"]),prescriptionController.deletePrescription);
router.get('/generate-pdf/:id',prescriptionController.generatePrescriptionPDF);

export default router;