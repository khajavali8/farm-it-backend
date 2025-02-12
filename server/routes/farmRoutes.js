import express from 'express';
import farmController from '../controllers/farmController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',  authenticateUser, farmController.createFarm);
router.get('/my-farms', authenticateUser, farmController.getMyFarms);
router.put('/:id', authenticateUser, farmController.updateFarm); 

export default router;