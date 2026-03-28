const express = require('express');
const router = express.Router();
const { listFraud, getFraud, resolveFraud, getFraudStats } = require('../controllers/fraudController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

/**
 * @swagger
 * /api/fraud:
 *   get:
 *     summary: List fraud alerts
 *     tags: [Fraud]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *       - in: query
 *         name: alertType
 *         schema:
 *           type: string
 *       - in: query
 *         name: resolved
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
 *         description: List of fraud alerts
 */
router.get('/', listFraud);

/**
 * @swagger
 * /api/fraud/stats:
 *   get:
 *     summary: Get fraud alert statistics
 *     tags: [Fraud]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fraud statistics
 */
router.get('/stats', getFraudStats);

/**
 * @swagger
 * /api/fraud/{id}:
 *   get:
 *     summary: Get a fraud alert by ID
 *     tags: [Fraud]
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
 *         description: Fraud alert
 */
router.get('/:id', getFraud);

/**
 * @swagger
 * /api/fraud/{id}/resolve:
 *   patch:
 *     summary: Resolve a fraud alert (admin only)
 *     tags: [Fraud]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resolutionNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Alert resolved
 */
router.patch('/:id/resolve', authorize('admin'), resolveFraud);

module.exports = router;
