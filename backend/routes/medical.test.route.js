import express from 'express'
import { createMedicalTest,readAllTests,readTestsById,updateTest,deleteTest,getTestsByDoctorId
} from '../controllers/medical.test.controller.js'

const router = express.Router()

router.post('/create', createMedicalTest)      
router.get('/readAll', readAllTests)       
router.get('/readById/:id', readTestsById)
router.put('/update/:id', updateTest)
router.delete('/delete/:id', deleteTest)
router.get('/readByDoctorId/:doctorId',getTestsByDoctorId)


export default router