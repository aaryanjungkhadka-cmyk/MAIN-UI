import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { firebaseAuth } from '../services/firebaseService.js';

export const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  // Development-only demo token. Never enable in production.
  if (config.allowDemoAuth && token === 'demo-token') {
    req.user = { id: 'demo-user' };
    return next();
  }

  // 1) Firebase ID token (what the frontend sends after login)
  try {
    const decoded = await firebaseAuth().verifyIdToken(token);
    req.user = { ...decoded, id: decoded.uid };
    return next();
  } catch (firebaseError) {
    console.error('[auth] Firebase verifyIdToken failed:', firebaseError.code || '', firebaseError.message);
  }

  // 2) Fallback: app-signed JWT
  try {
    req.user = jwt.verify(token, config.jwtSecret);
    return next();
  } catch (jwtError) {
    console.error('[auth] JWT verify failed:', jwtError.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed validation' });
  }
};