import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getUserProfile,
  updateUserProfile,
  uploadLicense,
  getUserBookings
} from '../controllers/userControllers.js';
const router = express.Router();

// User profile routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/upload-license', protect, uploadLicense);
router.get('/bookings', protect, getUserBookings);

export default router;