import express from 'express';
import transactionController from '../controllers/transactionController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-transactions', authenticateUser, transactionController.getTransactions);
router.get('/analytics', authenticateUser, transactionController.getAnalytics);
router.get('/:id', authenticateUser, transactionController.getTransactionDetails);

export default router;
