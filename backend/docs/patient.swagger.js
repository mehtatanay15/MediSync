/**
 * @swagger
 * tags:
 *   name: Patient
 *   description: Patient profile management and prescriptions
 */

/**
 * @swagger
 * /api/patient/profile:
 *   get:
 *     summary: Get the logged-in patient's profile
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient profile fetched
 *       404:
 *         description: Patient profile not found
 *
 *   post:
 *     summary: Create patient profile
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Patient profile created
 *
 *   put:
 *     summary: Update logged-in patient's profile
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       200:
 *         description: Profile updated
 *
 *   delete:
 *     summary: Delete the logged-in patient's profile
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted
 */

/**
 * @swagger
 * /api/patient:
 *   get:
 *     summary: Get all patients (admin/internal use)
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: List of patients
 */

/**
 * @swagger
 * /api/patient/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient details
 *       404:
 *         description: Patient not found
 *
 *   put:
 *     summary: Update patient by ID
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       200:
 *         description: Patient updated
 *
 *   delete:
 *     summary: Delete patient by ID
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient deleted
 */

/**
 * @swagger
 * /api/patient/get-all-prescriptions/{id}:
 *   get:
 *     summary: Get all prescriptions for a patient
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prescriptions fetched
 *       404:
 *         description: Patient not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         age:
 *           type: number
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other]
 *         blood_group:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         doctors:
 *           type: array
 *           items:
 *             type: string
 *         test_reports:
 *           type: array
 *           items:
 *             type: string
 *       required:
 *         - name
 *         - age
 *         - gender
 *         - phone
 *         - address
 */