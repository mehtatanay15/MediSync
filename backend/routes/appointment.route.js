import express from 'express'
import { createAppointment,readAllAppointments, readAppointmentById, updateAppointment, deleteAppointment, getAllAppointmentsByPatientId,getAppointmentsByConsultationStatus, getAppointmentsByDoctorId, getAllAppointmentsByDate, approveAppointment,rejectAppointment, getAvailableBookingDates, appointmentsToday, appointmentsDate, forward, reverse, verifyClinicOrDoctor
} from '../controllers/appointment.controller.js'
import {auth} from '../middlewares/auth.middleware.js';

const router = express.Router()

router.post('/create', auth(['Patient']), createAppointment);      
router.get('/readAll', readAllAppointments);       
router.get('/readById/:id', readAppointmentById);
router.put('/update/:id', auth(["Patient"]),updateAppointment);
router.delete('/delete/:id', auth(["Patient"]),deleteAppointment);
router.get('/getByPatientId', auth(["Patient"]),getAllAppointmentsByPatientId);
router.get('/getByDate', getAllAppointmentsByDate);
// router.get('/getAvailableDate', getAvailableDates);
router.get('/status/:status', getAppointmentsByConsultationStatus);
router.get('/readByDoctorId', auth(["Doctor"]),getAppointmentsByDoctorId);
router.put('/:id/approve', auth(["Doctor"]), approveAppointment)
router.put('/:id/reject', auth(["Doctor"]), rejectAppointment)

//
router.get('/available-dates/:clinicId', getAvailableBookingDates)
router.get('/today', auth(["Clinic","Doctor"]), verifyClinicOrDoctor, appointmentsToday)
router.get('/date', auth(["Clinic","Doctor"]), verifyClinicOrDoctor, appointmentsDate)
router.put('/forward/:appointmentId', auth(["Clinic","Doctor"]), verifyClinicOrDoctor, forward)
router.put('/reverse/:appointmentId', auth(["Clinic","Doctor"]), verifyClinicOrDoctor, reverse)


export default router;
