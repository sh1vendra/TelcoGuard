const express = require('express');
const router = express.Router();
const { listAudit } = require('../controllers/auditController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/audit:
 *   get:
 *     summary: List audit logs with pagination
 *     tags: [Audit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
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
 *         description: List of audit logs
 */
router.get('/', protect, listAudit);

module.exports = router;
