const express = require('express');
const router = express.Router();
const { listPhones, getPhone, createPhone, updatePhone, deletePhone, changeStatus, getStats } = require('../controllers/phoneController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

/**
 * @swagger
 * /api/phones:
 *   get:
 *     summary: List phone numbers with filters and pagination
 *     tags: [Phones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: areaCode
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of phone numbers
 */
router.get('/', listPhones);

/**
 * @swagger
 * /api/phones/stats:
 *   get:
 *     summary: Get phone number statistics
 *     tags: [Phones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics
 */
router.get('/stats', getStats);

/**
 * @swagger
 * /api/phones/{id}:
 *   get:
 *     summary: Get a phone number by ID
 *     tags: [Phones]
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
 *         description: Phone number data
 */
router.get('/:id', getPhone);

/**
 * @swagger
 * /api/phones:
 *   post:
 *     summary: Create a phone number (admin only)
 *     tags: [Phones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhoneNumberInput'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authorize('admin'), createPhone);

/**
 * @swagger
 * /api/phones/{id}:
 *   put:
 *     summary: Update a phone number
 *     tags: [Phones]
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
 *         description: Updated
 */
router.put('/:id', authorize('admin', 'operator'), updatePhone);

/**
 * @swagger
 * /api/phones/{id}/status:
 *   patch:
 *     summary: Change phone number status
 *     tags: [Phones]
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
 *         description: Status updated
 */
router.patch('/:id/status', authorize('admin', 'operator'), changeStatus);

/**
 * @swagger
 * /api/phones/{id}:
 *   delete:
 *     summary: Delete a phone number (admin only)
 *     tags: [Phones]
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
 *         description: Deleted
 */
router.delete('/:id', authorize('admin'), deletePhone);

module.exports = router;
