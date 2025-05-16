import express from 'express'
import { createNotification, readAllNotifications, readNotificationById } from '../controllers/notification.controller.js'

const router = express.Router()

router.post('/create', createNotification )      
router.get('/readAll', readAllNotifications )       
router.get('/readById/:id', readNotificationById)

export default router
