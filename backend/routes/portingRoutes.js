const express = require('express');
const router = express.Router();
const { listPorting, getPorting, createPorting, approvePorting, rejectPorting } = require('../controllers/portingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

/**
 * @swagger
 * /api/porting:
 *   get:
 *     summary: List porting requests
 *     tags: [Porting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: flagged
 *         schema:
 *           type: boolean
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
 *         description: List of porting requests
 */
router.get('/', listPorting);

/**
 * @swagger
 * /api/porting/{id}:
 *   get:
 *     summary: Get a porting request by ID
 *     tags: [Porting]
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
 *         description: Porting request data
 */
router.get('/:id', getPorting);

/**
 * @swagger
 * /api/porting:
 *   post:
 *     summary: Create a porting request
 *     tags: [Porting]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PortingInput'
 *     responses:
 *       201:
 *         description: Porting request created
 */
router.post('/', createPorting);

/**
 * @swagger
 * /api/porting/{id}/approve:
 *   patch:
 *     summary: Approve a porting request (admin only)
 *     tags: [Porting]
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
 *         description: Approved
 */
router.patch('/:id/approve', authorize('admin'), approvePorting);

/**
 * @swagger
 * /api/porting/{id}/reject:
 *   patch:
 *     summary: Reject a porting request (admin only)
 *     tags: [Porting]
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
 *         description: Rejected
 */
router.patch('/:id/reject', authorize('admin'), rejectPorting);

module.exports = router;
