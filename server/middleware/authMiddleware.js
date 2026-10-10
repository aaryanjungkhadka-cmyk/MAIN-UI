import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { firebaseAuth } from '../services/firebaseService.js';

let cachedPublicKeys = null;
let lastKeysFetchedAt = 0;

async function getGooglePublicKeys() {
  const now = Date.now();
  if (cachedPublicKeys && now - lastKeysFetchedAt < 3600000) {
    return cachedPublicKeys;
  }
  const response = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
  if (!response.ok) {
    throw new Error('Failed to fetch Google public keys');
  }
  cachedPublicKeys = await response.json();
  lastKeysFetchedAt = now;
  return cachedPublicKeys;
}

async function verifyWithGooglePublicKeys(token, projectId) {
  const decoded = jwt.decode(token, { complete: true });
  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('Malformed token');
  }
  const keys = await getGooglePublicKeys();
  const publicKey = keys[decoded.header.kid];
  if (!publicKey) {
    throw new Error('No matching public key found for kid: ' + decoded.header.kid);
  }
  const payload = jwt.verify(token, publicKey, {
    algorithms: ['RS256'],
    issuer: 'https://securetoken.google.com/' + projectId,
    audience: projectId
  });
  return { ...payload, id: payload.sub, uid: payload.sub };
}

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

  // 1) Verify via firebase-admin if initialized with service account
  try {
    const decoded = await firebaseAuth().verifyIdToken(token);
    req.user = { ...decoded, id: decoded.uid };
    return next();
  } catch (firebaseError) {
    // If service account isn't configured, verify directly via Google public keys
    const projectId = config.firebaseProjectId || 'khanalens-np';
    try {
      const verified = await verifyWithGooglePublicKeys(token, projectId);
      req.user = verified;
      return next();
    } catch (googleError) {
      console.error('[auth] Google public key verification failed:', googleError.message);
    }
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