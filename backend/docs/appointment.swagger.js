/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Medical appointment management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         patient:
 *           type: string
 *           description: Reference to Patient ID
 *           example: "507f1f77bcf86cd799439012"
 *         doctor:
 *           type: string
 *           description: Reference to Doctor ID
 *           example: "507f1f77bcf86cd799439013"
 *         clinic:
 *           type: string
 *           description: Reference to Clinic ID
 *           example: "507f1f77bcf86cd799439014"
 *         preferred_date:
 *           type: string
 *           format: date-time
 *           example: "2023-10-15T00:00:00.000Z"
 *         appointment_number:
 *           type: number
 *           example: 5
 *         status:
 *           type: string
 *           enum: [Approved, Rejected, Pending, Completed, Not Arrived, Queued, Ongoing]
 *           example: "Queued"
 *         consultation_status:
 *           type: string
 *           enum: [Ongoing, Delayed, Queued, Not_Arrived]
 *           example: "Queued"
 *         patient_name:
 *           type: string
 *           example: "John Doe"
 *         patient_age:
 *           type: number
 *           example: 35
 *         patient_gender:
 *           type: string
 *           example: "Male"
 *         patient_blood_group:
 *           type: string
 *           example: "O+"
 *         patient_phone:
 *           type: string
 *           example: "+1234567890"
 *         patient_address:
 *           type: string
 *           example: "123 Main St, City, Country"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T10:30:00.000Z"
 * 
 *     AvailableDate:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2023-10-15"
 *         slots_left:
 *           type: number
 *           example: 3
 * 
 *     AppointmentStatusUpdate:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Status updated to Ongoing"
 *         appointment:
 *           $ref: '#/components/schemas/Appointment'
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /appointment/create:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - preferred_date
 *               - clinic
 *               - isForSelf
 *             properties:
 *               preferred_date:
 *                 type: string
 *                 description: Date in DD/MM/YYYY format
 *                 example: "15/10/2023"
 *               clinic:
 *                 type: string
 *                 description: Clinic ID
 *                 example: "507f1f77bcf86cd799439014"
 *               isForSelf:
 *                 type: boolean
 *                 example: true
 *               patient_name:
 *                 type: string
 *                 example: "John Doe"
 *               patient_age:
 *                 type: number
 *                 example: 35
 *               patient_gender:
 *                 type: string
 *                 example: "Male"
 *               patient_blood_group:
 *                 type: string
 *                 example: "O+"
 *               patient_phone:
 *                 type: string
 *                 example: "+1234567890"
 *               patient_address:
 *                 type: string
 *                 example: "123 Main St, City, Country"
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Clinic is fully booked for the selected date
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointment/readAll:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of all appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointment/readById/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Appointment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointment/update/{id}:
 *   put:
 *     summary: Update an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferred_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-10-15T00:00:00.000Z"
 *               status:
 *                 type: string
 *                 enum: [Approved, Rejected, Pending, Completed, Not Arrived, Queued, Ongoing]
 *                 example: "Approved"
 *               consultation_status:
 *                 type: string
 *                 enum: [Ongoing, Delayed, Queued, Not_Arrived]
 *                 example: "Queued"
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointment/delete/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Appointment deleted successfully"
 *                 appointment:
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointment/getByPatientId:
 *   get:
 *     summary: Get appointments by patient ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patient's appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointment/getByDate:
 *   get:
 *     summary: Get appointments by date
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferred_date:
 *                 type: string
 *                 description: Date in DD/MM/YYYY format
 *                 example: "15/10/2023"
 *     responses:
 *       200:
 *         description: List of appointments for the specified date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointment/status/{status}:
 *   get:
 *     summary: Get appointments by consultation status
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Ongoing, Delayed, Queued, Not_Arrived]
 *         example: "Queued"
 *     responses:
 *       200:
 *         description: List of appointments with the specified status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid consultation status provided
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointment/readByDoctorId:
 *   get:
 *     summary: Get appointments by doctor ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of doctor's appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: No appointments found for this doctor
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointment/{id}/approve:
 *   put:
 *     summary: Approve an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Appointment approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Appointment approved successfully"
 *                 appointment:
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Error approving appointment
 */

/**
 * @swagger
 * /appointment/{id}/reject:
 *   put:
 *     summary: Reject an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Appointment rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Appointment rejected successfully"
 *                 appointment:
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Error rejecting appointment
 */

/**
 * @swagger
 * /appointment/available-dates/{clinicId}:
 *   get:
 *     summary: Get available booking dates for a clinic
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: clinicId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439014"
 *     responses:
 *       200:
 *         description: List of available dates with slots left
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AvailableDate'
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /appointment/today:
 *   get:
 *     summary: Get today's appointments for a clinic
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's appointments grouped by status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 "Not Arrived":
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *                 "Queued":
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *                 "Ongoing":
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *                 "Completed":
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: clinicId is required
 *       500:
 *         description: Something went wrong
 */

/**
 * @swagger
 * /appointment/date:
 *   get:
 *     summary: Get appointments for a specific date
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           description: Date in YYYY-MM-DD format
 *         example: "2023-10-15"
 *     responses:
 *       200:
 *         description: Appointments for the specified date grouped by status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                 clinicId:
 *                   type: string
 *                 appointments:
 *                   type: object
 *                   properties:
 *                     notArrived:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Appointment'
 *                     queued:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Appointment'
 *                     ongoing:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Appointment'
 *                     completed:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid date format or missing parameters
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /appointment/forward/{appointmentId}:
 *   put:
 *     summary: Move appointment status forward
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentStatusUpdate'
 *       400:
 *         description: No valid next status
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /appointment/reverse/{appointmentId}:
 *   put:
 *     summary: Move appointment status backward
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Status reverted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentStatusUpdate'
 *       400:
 *         description: No previous status to revert to
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */