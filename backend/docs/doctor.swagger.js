/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: Doctor-related endpoints
 */

/**
 * @swagger
 * /api/doctor/register:
 *   post:
 *     summary: Register a new doctor profile
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - experience
 *               - consultation_fees
 *               - gender
 *               - dob
 *               - specialization_status
 *               - phone
 *             properties:
 *               user:
 *                 type: string
 *               experience:
 *                 type: number
 *               consultation_fees:
 *                 type: number
 *               gender:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               specialization_status:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor profile created
 *       400:
 *         description: Invalid input or duplicate doctor
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/doctor/profile:
 *   get:
 *     summary: Get authenticated doctor's profile
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor profile
 *       404:
 *         description: Doctor profile not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update authenticated doctor's profile
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               experience:
 *                 type: number
 *               consultation_fees:
 *                 type: number
 *               specialization_status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       404:
 *         description: Doctor profile not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete authenticated doctor's profile
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted
 *       404:
 *         description: Doctor profile not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/doctor:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all doctors
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/doctor/profile/patients:
 *   get:
 *     summary: Get all patients for authenticated doctor
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients
 *       404:
 *         description: Doctor profile not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/doctor/getPatient/{id}:
 *   get:
 *     summary: Get a specific patient by ID
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient data
 *       404:
 *         description: Patient or doctor not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/doctor/by-specialization:
 *   get:
 *     summary: Get doctors by specialization
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *         required: true
 *         description: Specialization to filter doctors
 *     responses:
 *       200:
 *         description: List of doctors with given specialization
 *       400:
 *         description: Specialization query is required
 *       500:
 *         description: Server error
 */
