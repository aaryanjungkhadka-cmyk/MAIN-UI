# chapters_16_solutions.py - Chapter 16: Practical Coding Exercises with Complete Solutions
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, PageBreak
from .styles import escape_xml

def build_chapters_16_solutions(b):
    styles = b.styles

    # =========================================================
    # CHAPTER 16: PRACTICAL EXERCISES WITH COMPLETE SOLUTIONS
    # =========================================================
    b.chapter_banner(
        "16",
        "Practical Coding Exercises with Step-by-Step Solutions",
        "Hands-on architectural and code-level exercises with complete, production-ready solutions and line-by-line breakdowns"
    )

    b.p(
        "True engineering competence is built through hands-on implementation. This chapter presents six comprehensive, "
        "production-grade coding challenges covering frontend state, custom hooks, backend REST APIs, NoSQL database mutations, "
        "algorithmic date calculations, and complex responsive CSS layouts. Every exercise includes the full, working source code "
        "and a detailed line-by-line explanation."
    )
    b.spacer(6)

    # ---------------------------------------------------------
    # EXERCISE 1: CUSTOM REACT PORTION MULTIPLIER HOOK
    # ---------------------------------------------------------
    b.section("16.1 Exercise 1: Dynamic Meal Portion Multiplier (React State & Hook)")
    b.p(
        "<b>Problem Statement:</b> In `FoodAnalysisResult.jsx`, the AI calculates calories and macros based on an estimated default portion. "
        "Users frequently eat a larger or smaller serving (e.g. 1.5 plates of Momo or 0.5 bowl of Dal Bhat). "
        "Create a reusable custom hook `usePortionMultiplier` that manages portion scaling (0.5x to 3.0x), recalculates calories, "
        "protein, carbs, and fat in real time, and prevents floating-point rounding errors."
    )

    ex1_code = """// client/src/hooks/usePortionMultiplier.js
import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook to scale meal macronutrients dynamically with portion changes.
 * @param {Object} baseNutrients - { calories: 520, protein: 24, carbs: 68, fat: 14 }
 * @param {number} initialMultiplier - Initial portion factor (default: 1.0)
 */
export function usePortionMultiplier(baseNutrients = {}, initialMultiplier = 1.0) {
  const [portion, setPortion] = useState(initialMultiplier);

  // Recalculate nutrients whenever base values or portion changes
  const scaledNutrients = useMemo(() => {
    const factor = Math.max(0.25, Math.min(4.0, Number(portion) || 1.0));
    return {
      calories: Math.round((Number(baseNutrients.calories) || 0) * factor),
      protein: Math.round(((Number(baseNutrients.protein) || 0) * factor) * 10) / 10,
      carbs: Math.round(((Number(baseNutrients.carbs) || 0) * factor) * 10) / 10,
      fat: Math.round(((Number(baseNutrients.fat) || 0) * factor) * 10) / 10,
      factor
    };
  }, [baseNutrients, portion]);

  // Safe handler to update portion from slider or buttons
  const updatePortion = useCallback((nextPortion) => {
    const val = typeof nextPortion === 'function' ? nextPortion(portion) : nextPortion;
    setPortion(Math.round(val * 10) / 10);
  }, [portion]);

  return { portion, scaledNutrients, updatePortion };
}"""
    b.code_block(ex1_code, filename="client/src/hooks/usePortionMultiplier.js", title="Exercise 1 Complete Solution")

    b.p("<b>Line-by-Line Solution Explanation:</b>")
    b.bullet("<b>Lines 1-7:</b> Imports `useState`, `useMemo`, and `useCallback` from React to ensure high rendering performance without unnecessary recalculations.")
    b.bullet("<b>Line 9:</b> `portion` state tracks the current scalar factor (e.g., 1.0, 1.5).")
    b.bullet("<b>Lines 12-21:</b> `useMemo` clamps the portion factor safely between `0.25` and `4.0` using `Math.max` and `Math.min`. It multiplies each macro by the factor and rounds calories to the nearest integer while keeping 1 decimal place for grams (`Math.round(x * 10) / 10`), avoiding ugly floating-point numbers like `24.0000000004`.")
    b.bullet("<b>Lines 24-27:</b> `updatePortion` provides a memoized callback that accepts either direct numbers or functional updater state patterns (`p => p + 0.1`).")
    b.spacer(8)

    # ---------------------------------------------------------
    # EXERCISE 2: WATER HYDRATION TRACKER WITH LOCALSTORAGE
    # ---------------------------------------------------------
    b.section("16.2 Exercise 2: Daily Water Hydration Tracker (Component & Persistence)")
    b.p(
        "<b>Problem Statement:</b> Hydration is vital for metabolic health. Build a modern `WaterTracker.jsx` component for the dashboard. "
        "It must: (1) Track milliliters drunk today towards a 3,000ml goal, (2) Provide quick +250ml (glass) and +500ml (bottle) buttons, "
        "(3) Automatically reset at midnight for a new day, and (4) Persist today's progress in `localStorage`."
    )

    ex2_code = """// client/src/components/WaterTracker.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Droplet, Plus, RotateCcw } from 'lucide-react';

const DAILY_GOAL_ML = 3000;

export default function WaterTracker() {
  const todayKey = useMemo(() => {
    return `khanalens_water_${new Date().toISOString().split('T')[0]}`;
  }, []);

  const [waterMl, setWaterMl] = useState(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  // Persist to localStorage whenever water intake changes
  useEffect(() => {
    try {
      localStorage.setItem(todayKey, String(waterMl));
    } catch (err) {
      console.warn('Failed to save water intake:', err);
    }
  }, [waterMl, todayKey]);

  const addWater = (amount) => {
    setWaterMl((prev) => Math.min(DAILY_GOAL_ML + 1000, prev + amount));
  };

  const resetWater = () => setWaterMl(0);

  const percentage = Math.min(100, Math.round((waterMl / DAILY_GOAL_ML) * 100));

  return (
    <div className=\"water-card\" style={{ background: '#FFFFFF', borderRadius: 18, padding: 16, border: '1px solid #E3DCB8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: 'rgba(74, 144, 226, 0.15)', padding: 6, borderRadius: 8, color: '#3178C6' }}>
            <Droplet size={18} />
          </div>
          <h4 style={{ margin: 0, color: '#1F4D33', fontSize: 14, fontWeight: 700 }}>Daily Hydration</h4>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#3178C6' }}>{waterMl} / {DAILY_GOAL_ML} ml</span>
      </div>

      {/* Progress Bar */}
      <div style={{ height: 8, background: '#EAE5D8', borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ width: `${percentage}%`, height: '100%', background: '#3178C6', transition: 'width 0.3s ease' }} />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type=\"button\" onClick={() => addWater(250)} style={{ flex: 1, padding: '6px 10px', background: '#F2EADA', border: '1px solid #D1C8AC', borderRadius: 8, fontSize: 11, fontWeight: 700, color: '#1F4D33', cursor: 'pointer' }}>+250ml Glass</button>
        <button type=\"button\" onClick={() => addWater(500)} style={{ flex: 1, padding: '6px 10px', background: '#F2EADA', border: '1px solid #D1C8AC', borderRadius: 8, fontSize: 11, fontWeight: 700, color: '#1F4D33', cursor: 'pointer' }}>+500ml Bottle</button>
        <button type=\"button\" onClick={resetWater} title=\"Reset\" style={{ padding: '6px 8px', background: 'transparent', border: '1px solid #D1C8AC', borderRadius: 8, color: '#7A7365', cursor: 'pointer' }}><RotateCcw size={14} /></button>
      </div>
    </div>
  );
}"""
    b.code_block(ex2_code, filename="client/src/components/WaterTracker.jsx", title="Exercise 2 Complete Solution")

    b.p("<b>Line-by-Line Solution Explanation:</b>")
    b.bullet("<b>Lines 7-9:</b> Generates a date-scoped storage key: `khanalens_water_2026-11-19`. When midnight passes, the date string changes automatically, giving the user a fresh 0ml tracker for the new day without complex cron jobs!")
    b.bullet("<b>Lines 11-18:</b> Lazy state initialization reads `localStorage` synchronously during component mount. If previous intake exists for today, it restores immediately.")
    b.bullet("<b>Lines 21-27:</b> `useEffect` automatically synchronizes any state change back into `localStorage`.")
    b.bullet("<b>Lines 29-31:</b> `addWater` uses functional state updater `prev => ...` to avoid stale closures, capping maximum intake safely.")
    b.page_break()

    # ---------------------------------------------------------
    # EXERCISE 3: SERVER-SIDE REST API MEAL DELETION
    # ---------------------------------------------------------
    b.section("16.3 Exercise 3: Meal Deletion REST API with Dual-Mode Support")
    b.p(
        "<b>Problem Statement:</b> When a user accidentally scans the wrong meal, they need to delete it from their history. "
        "Implement a production Express route controller `deleteMeal` in `server/controllers/nutritionController.js` that: "
        "(1) Verifies user ownership (prevents deleting other users' meals), (2) Deletes the document from Cloud Firestore, "
        "(3) Falls back cleanly to `inMemoryNutritionStore.js` when in dual-mode, and (4) Returns proper HTTP 200, 403, and 404 responses."
    )

    ex3_code = """// server/controllers/nutritionController.js (deleteMeal implementation)
export const deleteMeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid || req.user?.id || 'guest_user';

    if (!id) {
      return res.status(400).json({ success: false, error: 'Meal ID is required' });
    }

    // 1. Dual-Mode: Attempt Cloud Firestore Deletion first
    if (firestoreService.isAvailable()) {
      const mealDoc = await firestoreService.getMealById(id);
      
      if (!mealDoc) {
        return res.status(404).json({ success: false, error: 'Meal record not found' });
      }

      // Security Check: Verify user owns this meal
      if (mealDoc.userId !== userId) {
        return res.status(403).json({ success: false, error: 'Unauthorized to delete this record' });
      }

      await firestoreService.deleteMeal(id);
      return res.json({ success: true, message: 'Meal deleted successfully', deletedId: id });
    }

    // 2. Dual-Mode Fallback: In-Memory Store
    const memoryRecord = inMemoryNutritionStore.getMeal(id);
    if (!memoryRecord) {
      return res.status(404).json({ success: false, error: 'Meal record not found in memory' });
    }

    if (memoryRecord.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized to delete this record' });
    }

    inMemoryNutritionStore.deleteMeal(id);
    return res.json({ success: true, message: 'Meal deleted from in-memory store', deletedId: id });
  } catch (error) {
    next(error); // Forward to global errorMiddleware
  }
};"""
    b.code_block(ex3_code, filename="server/controllers/nutritionController.js", title="Exercise 3 Complete Solution")

    b.p("<b>Line-by-Line Solution Explanation:</b>")
    b.bullet("<b>Lines 3-4:</b> Extracts the meal document `id` from route parameters (`req.params.id`) and the authenticated `userId` from `req.user` populated by `authMiddleware.js`.")
    b.bullet("<b>Lines 10-18:</b> Follows the Principle of Least Privilege: fetches the meal document and verifies `mealDoc.userId === userId` before calling `.delete()`. This blocks IDOR (Insecure Direct Object Reference) exploits where a malicious user tries guessing another user's UUID.")
    b.bullet("<b>Lines 23-33:</b> Graceful dual-mode fallback: if Firestore credentials are not configured, seamlessly removes the meal from the in-memory store, returning identical JSON structure.")
    b.bullet("<b>Line 35:</b> Delegates uncaught database errors to Express global `errorMiddleware` via `next(error)`.")
    b.spacer(8)

    # ---------------------------------------------------------
    # EXERCISE 4: WEBRTC CAMERA STREAM RESILIENCE HOOK
    # ---------------------------------------------------------
    b.section("16.4 Exercise 4: Resilient WebRTC Camera Hook (`useCameraStream`)")
    b.p(
        "<b>Problem Statement:</b> Mobile devices have widely varying camera hardware (multi-lens wide/macro arrays, front/rear). "
        "Strict constraints like `facingMode: { exact: 'environment' }` frequently throw `OverconstrainedError` or `NotAllowedError`. "
        "Write a robust custom hook `useCameraStream` that initializes the camera, handles permissions, provides fallback constraints, "
        "and properly releases camera hardware on unmount."
    )

    ex4_code = """// client/src/hooks/useCameraStream.js
import { useState, useEffect, useRef, useCallback } from 'react';

export function useCameraStream() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'active' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopStream();
    setStatus('loading');
    setErrorMessage('');

    // Security Check: WebRTC requires HTTPS or localhost
    if (!window.isSecureContext) {
      setStatus('error');
      setErrorMessage('Camera requires a secure HTTPS connection.');
      return;
    }

    try {
      // Primary attempt: Ideal facing mode with high resolution
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setStatus('active');
    } catch (err) {
      console.warn('Primary camera constraint failed, attempting basic fallback...', err);
      try {
        // Fallback attempt: Any video device without strict resolution
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play().catch(() => {});
        }
        setStatus('active');
      } catch (fallbackErr) {
        setStatus('error');
        setErrorMessage(fallbackErr.name === 'NotAllowedError' ? 'Camera permission was denied.' : 'Camera hardware error.');
      }
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    startCamera();
    return () => stopStream(); // Clean hardware release on component unmount
  }, [startCamera, stopStream]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return { videoRef, status, errorMessage, toggleFacingMode, facingMode, retry: startCamera };
}"""
    b.code_block(ex4_code, filename="client/src/hooks/useCameraStream.js", title="Exercise 4 Complete Solution")

    b.p("<b>Line-by-Line Solution Explanation:</b>")
    b.bullet("<b>Lines 10-15:</b> `stopStream` loops through all media stream tracks calling `track.stop()`. This is critical: if you don't stop tracks, the phone's camera light stays green and drains the battery even after navigating away!")
    b.bullet("<b>Lines 21-25:</b> Checks `window.isSecureContext`. Browsers strictly block WebRTC camera access over plain HTTP (except `localhost`).")
    b.bullet("<b>Lines 29-37:</b> Uses `{ ideal: facingMode }` rather than `{ exact: facingMode }`. If a dual-camera Android phone doesn't have an exact 'environment' label, the browser gracefully selects the best available rear sensor instead of crashing.")
    b.bullet("<b>Lines 44-55:</b> Two-tier fallback: if 1080p ideal resolution throws an error, it immediately catches and attempts `{ video: true }` without resolution requirements before reporting failure.")
    b.bullet("<b>Line 60:</b> Cleanup function inside `useEffect` guarantees that unmounting the scanner page immediately terminates camera access.")
    b.page_break()

    # ---------------------------------------------------------
    # EXERCISE 5: STREAK CALCULATION ENGINE WITH DATE MATH
    # ---------------------------------------------------------
    b.section("16.5 Exercise 5: Streak Engine Calculation from Raw Timestamps")
    b.p(
        "<b>Problem Statement:</b> Gamification drives daily retention. Given an unsorted array of meal timestamps (ISO strings), "
        "write a pure JavaScript function `computeNutritionalStreak(mealTimestamps, referenceDate)` that: "
        "(1) Normalizes timestamps to the user's local timezone (ignoring hours/minutes), (2) Identifies unique active dates, "
        "(3) Awards a streak if the user logged today OR yesterday (grace period), and (4) Counts backwards consecutively."
    )

    ex5_code = """// client/src/data/streak.js (Pure algorithmic streak computation)
/**
 * Calculates consecutive daily logging streak from raw meal timestamps.
 * @param {string[]} timestamps - Array of ISO timestamp strings ['2026-11-19T10:14:00Z', ...]
 * @param {Date} referenceNow - Anchor date (default: new Date())
 * @returns {number} Current streak in days
 */
export function computeNutritionalStreak(timestamps = [], referenceNow = new Date()) {
  if (!Array.isArray(timestamps) || timestamps.length === 0) return 0;

  // Helper to format a Date object as 'YYYY-MM-DD' in local time
  const toLocalDateStr = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 1. Extract unique active dates
  const activeDates = new Set();
  timestamps.forEach((ts) => {
    try {
      const d = new Date(ts);
      if (!isNaN(d.getTime())) {
        activeDates.add(toLocalDateStr(d));
      }
    } catch {}
  });

  const todayStr = toLocalDateStr(referenceNow);

  // Compute yesterday
  const yesterdayDate = new Date(referenceNow);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = toLocalDateStr(yesterdayDate);

  // 2. Check if streak is alive (logged today OR yesterday)
  let currentDate = null;
  if (activeDates.has(todayStr)) {
    currentDate = new Date(referenceNow);
  } else if (activeDates.has(yesterdayStr)) {
    currentDate = yesterdayDate;
  } else {
    return 0; // Streak broken: No logs today or yesterday
  }

  // 3. Count backwards consecutively
  let streak = 0;
  while (true) {
    const checkStr = toLocalDateStr(currentDate);
    if (activeDates.has(checkStr)) {
      streak += 1;
      // Step back 1 day
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break; // Gap encountered
    }
  }

  return streak;
}"""
    b.code_block(ex5_code, filename="client/src/data/streak.js", title="Exercise 5 Complete Solution")

    b.p("<b>Line-by-Line Solution Explanation:</b>")
    b.bullet("<b>Lines 10-15:</b> `toLocalDateStr` extracts local year, month, and day without UTC conversion offset errors. Beginners often use `.toISOString().split('T')[0]`, which shifts the date backwards by 1 day for users in Kathmandu (UTC+5:45) logging after 6 PM!")
    b.bullet("<b>Lines 18-26:</b> `Set` guarantees unique calendar days, eliminating duplicate meals logged on the same day.")
    b.bullet("<b>Lines 33-40:</b> Grace Period Logic: If a user hasn't logged breakfast yet today, their streak is still alive from yesterday. If they haven't logged yesterday or today, the streak immediately drops to 0.")
    b.bullet("<b>Lines 43-52:</b> While-loop steps backward 1 calendar day on each iteration using `currentDate.setDate(currentDate.getDate() - 1)`. The moment a calendar date is missing from the Set, the loop breaks and returns the streak count.")
    b.spacer(8)

    # ---------------------------------------------------------
    # EXERCISE 6: RESPONSIVE CAROUSEL STACKING & TOUCH SWIPE
    # ---------------------------------------------------------
    b.section("16.6 Exercise 6: Responsive 16:9 Carousel with Touch Swiping")
    b.p(
        "<b>Problem Statement:</b> Implement a mobile touch-friendly carousel in React that: (1) Locks strictly to a 16:9 aspect ratio, "
        "(2) Listens for horizontal touch swipes (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with a 40px threshold, "
        "(3) Advances automatically every 3 seconds, and (4) Pauses on mouse enter or touch interaction."
    )

    ex6_code = """// client/src/components/SponsorCarousel.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function SponsorCarousel({ sponsors = [], intervalMs = 3000 }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const nextSlide = useCallback(() => {
    if (sponsors.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % sponsors.length);
  }, [sponsors.length]);

  const prevSlide = useCallback(() => {
    if (sponsors.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + sponsors.length) % sponsors.length);
  }, [sponsors.length]);

  // Autoplay timer with pause support
  useEffect(() => {
    if (isPaused || sponsors.length <= 1) return;
    const timer = setInterval(nextSlide, intervalMs);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, intervalMs, sponsors.length]);

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchDeltaX.current > 40) {
      prevSlide(); // Swiped right
    } else if (touchDeltaX.current < -40) {
      nextSlide(); // Swiped left
    }
  };

  return (
    <div
      className=\"carousel-container\"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: 20, overflow: 'hidden' }}
    >
      <div
        className=\"carousel-track\"
        style={{ display: 'flex', width: '100%', height: '100%', transform: `translateX(-${activeIndex * 100}%)`, transition: 'transform 0.4s ease' }}
      >
        {sponsors.map((ad, idx) => (
          <div key={ad.id || idx} style={{ flex: '0 0 100%', width: '100%', height: '100%', position: 'relative' }}>
            <img src={ad.imageUrl} alt={ad.sponsorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    </div>
  );
}"""
    b.code_block(ex6_code, filename="client/src/components/SponsorCarousel.jsx", title="Exercise 6 Complete Solution")

    b.p("<b>Line-by-Line Solution Explanation:</b>")
    b.bullet("<b>Lines 10-18:</b> Modulo arithmetic `(prev + 1) % len` and `(prev - 1 + len) % len` creates infinite carousel wrapping without index out-of-bounds crashes.")
    b.bullet("<b>Lines 20-25:</b> `useEffect` sets a clean interval that automatically resets and pauses whenever `isPaused` becomes true (during touch dragging or desktop mouse hover).")
    b.bullet("<b>Lines 28-44:</b> Tracks `clientX` delta. A 40px threshold prevents tiny accidental tremors from prematurely switching slides while the user scrolls down the page.")
    b.bullet("<b>Line 54:</b> `aspectRatio: '16 / 9'` forces strict mathematical proportionality regardless of whether the screen is a 360px mobile viewport or a 1440px desktop display.")

    b.page_break()
