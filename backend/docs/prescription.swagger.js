/**
 * @swagger
 * tags:
 *   name: Prescriptions
 *   description: API for managing prescriptions
 */

/**
 * @swagger
 * /api/prescription/create/{appointmentId}:
 *   post:
 *     summary: Create a new prescription
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disease:
 *                 type: string
 *               medicine:
 *                 type: string
 *               remarks:
 *                 type: string
 *               medical_tests:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Prescription created
 *       400:
 *         description: Bad request
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/prescription/get:
 *   get:
 *     summary: Get all prescriptions
 *     tags: [Prescriptions]
 *     responses:
 *       200:
 *         description: List of all prescriptions
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/prescription/get/{id}:
 *   get:
 *     summary: Get a prescription by ID
 *     tags: [Prescriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Prescription ID
 *     responses:
 *       200:
 *         description: Prescription data
 *       404:
 *         description: Prescription not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/prescription/update/{id}:
 *   put:
 *     summary: Update a prescription
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Prescription ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disease:
 *                 type: string
 *               medicine:
 *                 type: string
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prescription updated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/prescription/delete/{id}:
 *   delete:
 *     summary: Delete a prescription
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Prescription ID
 *     responses:
 *       200:
 *         description: Prescription deleted
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/prescription/generate-pdf/{id}:
 *   get:
 *     summary: Generate PDF for a prescription
 *     tags: [Prescriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Prescription ID
 *     responses:
 *       200:
 *         description: PDF generated and uploaded
 *       404:
 *         description: Prescription not found
 *       500:
 *         description: Server error
 */
