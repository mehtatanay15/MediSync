import express from 'express'
import { createClinic,readAllClinics,readClinicById,updateClinic,deleteClinic, addDoctorToMyClinic, searchClinics
} from '../controllers/clinic.controller.js'
import auth from '../middlewares/auth.middleware.js';
const router = express.Router()

router.post('/', auth(["Clinic"]),createClinic)      
router.get('/', readAllClinics) 
router.get('/search',searchClinics)      
router.get('/:id', readClinicById)
router.put('/:id', updateClinic)
router.delete('/:id', deleteClinic)
router.post('/add-doctor', auth(["Clinic"]), addDoctorToMyClinic)
export default router