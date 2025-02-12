import express from 'express';
import loanController from '../controllers/loanController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Farmer 
router.post('/create', authenticateUser, loanController.createLoan);
router.get('/my-loans', authenticateUser, loanController.getMyLoans);
router.post('/:id/repay', authenticateUser, loanController.repayLoan);
router.get('/:id/schedule', authenticateUser, loanController.getRepaymentSchedule);

// Investor
router.get('/my-investments', authenticateUser, loanController.getMyInvestments);
router.get('/available-loans', authenticateUser, loanController.getAvailableLoans);
router.post('/:id/invest', authenticateUser, loanController.investInLoan);

export default router;
