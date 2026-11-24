import { sponsorService } from '../services/sponsorService.js';

// Public: Get active sponsors for dashboard
export const getActiveSponsors = async (req, res, next) => {
  try {
    const { category, limit } = req.query;
    const sponsors = sponsorService.getActiveSponsors({ category, limit });
    
    // Automatically count impressions
    sponsors.forEach((s) => sponsorService.trackImpression(s.id));

    res.status(200).json({
      success: true,
      data: sponsors
    });
  } catch (error) {
    next(error);
  }
};

// Public: Track ad click and return destination
export const trackSponsorClick = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = sponsorService.trackClick(id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Sponsor not found' });
    }
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all sponsors
export const getAllSponsors = async (req, res, next) => {
  try {
    const all = sponsorService.getAllSponsors();
    res.status(200).json({
      success: true,
      data: all
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create sponsor
export const createSponsor = async (req, res, next) => {
  try {
    const newSponsor = sponsorService.createSponsor(req.body);
    res.status(201).json({
      success: true,
      data: newSponsor
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update sponsor
export const updateSponsor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = sponsorService.updateSponsor(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Sponsor not found' });
    }
    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete sponsor
export const deleteSponsor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = sponsorService.deleteSponsor(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Sponsor not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Sponsor deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
