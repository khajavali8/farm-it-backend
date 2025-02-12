import express from 'express';
import documentController from '../controllers/documentController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/upload', authenticateUser, documentController.uploadDocument);
router.get('/my-documents', authenticateUser, documentController.getMyDocuments);
router.delete('/:id', authenticateUser, documentController.deleteDocument);

export default router;
