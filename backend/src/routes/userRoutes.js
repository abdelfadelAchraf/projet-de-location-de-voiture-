
import express from 'express';
import { protect } from '../middleware/auth.js';
const router = express.Router();

// User profile routes
router.get('/profile', protect, (req, res) => {
  res.json({ message: 'Get user profile - to be implemented' });
});

router.put('/profile', protect, (req, res) => {
  res.json({ message: 'Update user profile - to be implemented' });
});

router.post('/upload-license', protect, (req, res) => {
  res.json({ message: 'Upload driver license - to be implemented' });
});

router.get('/bookings', protect, (req, res) => {
  res.json({ message: 'Get user bookings - to be implemented' });
});

export default router;