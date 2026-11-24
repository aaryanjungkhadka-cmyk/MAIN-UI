import express from 'express';
import {
  getActiveSponsors,
  trackSponsorClick,
  getAllSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor
} from '../controllers/sponsorController.js';

const router = express.Router();

// Public routes for dashboard
router.get('/', getActiveSponsors);
router.post('/:id/click', trackSponsorClick);

// Admin routes (prepared for future admin dashboard)
router.get('/admin/all', getAllSponsors);
router.post('/admin', createSponsor);
router.put('/admin/:id', updateSponsor);
router.delete('/admin/:id', deleteSponsor);

export default router;
