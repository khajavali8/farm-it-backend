import express from 'express';
import issueController from '../controllers/issueController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/add-issue', authenticateUser, issueController.reportIssue);
router.get('/all-issues', authenticateUser, issueController.getAllIssues);

export default router;