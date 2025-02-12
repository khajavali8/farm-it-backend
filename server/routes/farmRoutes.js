import express from 'express';
import farmController, { upload } from '../controllers/farmController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, upload.array('images', 5), farmController.createFarm);
router.get('/my-farms', authenticateUser, farmController.getMyFarms);
router.put('/:id', authenticateUser, farmController.updateFarm);

export default router;
