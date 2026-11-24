# chapters_8_features.py - Chapter 8: Complete KhanaLens Feature Breakdown
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, PageBreak
from .styles import escape_xml

def build_chapters_8_features(b):
    styles = b.styles

    # =========================================================
    # CHAPTER 8: KHANALENS FEATURE BREAKDOWN
    # =========================================================
    b.chapter_banner(
        "8",
        "KhanaLens Feature Breakdown",
        "Comprehensive architectural and code-level breakdown of all 15 core application features"
    )

    b.p(
        "This chapter is the technical heart of the handbook. We dissect each of the 15 features built into KhanaLens. "
        "For every feature, you will find: (1) Relevant source files, (2) Component hierarchy, (3) CSS implementation, "
        "(4) JavaScript logic, (5) State management, (6) External dependencies, (7) User interactions, and (8) Exact instructions on how to modify it."
    )
    b.spacer(6)

    # ---------------------------------------------------------
    # FEATURE 1: WELCOME SCREEN (LANDING & SPLASH)
    # ---------------------------------------------------------
    b.section("Feature 1: Welcome Screen (LandingPage & SplashPage)")
    b.p("The welcome screen introduces users to KhanaLens, displaying the high-definition Doko hero video and driving onboarding.")
    
    f1_headers = ["Aspect", "Technical Implementation Details"]
    f1_rows = [
        ["1. Source Files", "`client/src/pages/LandingPage.jsx`, `client/src/pages/SplashPage.jsx`, `client/src/assets/videos/doko-landing-hero.mp4`"],
        ["2. Components", "`LandingPage` component rendering background video, SVG grain texture overlay, BrandLogo, and CTA button."],
        ["3. CSS Styling", "`landingStyles` string injecting responsive mobile viewport styles: `max-height: 100dvh`, `clamp(14px, 2.4dvh, 22px)` safe padding, and linear gradient `#FBF8F0` to `#F2EADA`."],
        ["4. JS Logic", "`useRef` attaches to the HTML5 video element. Video plays automatically with `playsInline`, `muted`, and `loop`. Poster image displays while video buffers."],
        ["5. State Management", "Stateless visual route; relies on React Router `Link` component to transition to `/login` or `/home`."],
        ["6. Dependencies", "`react-router-dom` (Link), `lucide-react` (ArrowRight)."],
        ["7. User Interactions", "Tapping 'Get Started' navigates to `/login`. Tapping 'Already have an account? Sign In' navigates to login."],
        ["8. How to Modify", "To change the headline, edit lines 165-170 in `LandingPage.jsx`. To change the video, replace `doko-landing-hero.mp4` in `client/src/assets/videos/`."]
    ]
    b.table(f1_headers, f1_rows, [110, 405])
    b.spacer(8)

    # ---------------------------------------------------------
    # FEATURE 2: SIGNUP AND LOGIN
    # ---------------------------------------------------------
    b.section("Feature 2: Signup and Login")
    b.p("Provides secure user authentication via Firebase Email/Password and one-tap Google Sign-In.")

    f2_headers = ["Aspect", "Technical Implementation Details"]
    f2_rows = [
        ["1. Source Files", "`client/src/pages/Login.jsx`, `client/src/services/firebaseAuth.js`, `client/src/context/AuthContext.jsx`"],
        ["2. Components", "`Login` functional component, `BrandLogo`, tab switcher buttons (Sign In / Sign Up), and Google Sign-In button."],
        ["3. CSS Styling", "`loginCss` scoped CSS with custom `@font-face` injection, floating input field styling, and `#1F4D33` submit button with hover effects."],
        ["4. JS Logic", "`handleSubmit` validates email format and password length (min 6 chars). Calls `firebaseSignIn` or `firebaseSignUp`. Google sign-in triggers `signInWithPopup(auth, provider)`."],
        ["5. State Management", "`useState(isSignUp)` toggles mode; `useState(formData)` stores email, password, name; `useAuth().login(token, user)` persists session to `localStorage`."],
        ["6. Dependencies", "`firebase/auth` (GoogleAuthProvider, signInWithPopup), `lucide-react`."],
        ["7. User Interactions", "Typing credentials, switching tabs, clicking Google Sign-In popup, displaying descriptive inline error messages on failure."],
        ["8. How to Modify", "To add password reset, implement Firebase's `sendPasswordResetEmail(auth, email)` in `firebaseAuth.js` and add a 'Forgot Password?' link in `Login.jsx`."]
    ]
    b.table(f2_headers, f2_rows, [110, 405])
    b.spacer(8)

    # ---------------------------------------------------------
    # FEATURE 3: MAIN DASHBOARD
    # ---------------------------------------------------------
    b.section("Feature 3: Main Dashboard")
    b.p("The primary hub after authentication, presenting daily calories, macro rings, Doko mascot, streak counter, and partner banners.")

    f3_headers = ["Aspect", "Technical Implementation Details"]
    f3_rows = [
        ["1. Source Files", "`client/src/pages/Home.jsx`, `client/src/components/AppHeader.jsx`, `client/src/components/BottomNav.jsx`"],
        ["2. Components", "`Home`, `AppHeader`, `DokoMascot`, `BottomNav`, `Avatar`, and sponsor card carousel."],
        ["3. CSS Styling", "`homeCss` injecting `@keyframes fade-up`, `@keyframes pulse-soft`, `@property --progress` for radial angles, and `.dashboard-viewport` layout."],
        ["4. JS Logic", "Fetches profile, progress, and sponsors in parallel via `Promise.all([getProfileApi(), getProgressApi(), getSponsorsApi()])`. Computes daily macro percentages."],
        ["5. State Management", "`summary` state holds daily macros; `profile` state holds goals; `sponsors` holds ad campaigns; `activeSponsorIndex` tracks carousel slide."],
        ["6. Dependencies", "`axios` (via api.js), `lucide-react` (Camera, Droplet, Dumbbell, UtensilsCrossed, Wheat)."],
        ["7. User Interactions", "Tapping 'Scan Food' CTA navigates to `/scan`; tapping partner banners triggers click telemetry; tapping streak navigates to `/streak`."],
        ["8. How to Modify", "To change the default daily calorie target, edit `defaultSummary.calorieGoal = 2000` at line 28 of `Home.jsx`."]
    ]
    b.table(f3_headers, f3_rows, [110, 405])
    b.spacer(8)

    # ---------------------------------------------------------
    # FEATURE 4: DOKO MASCOT
    # ---------------------------------------------------------
    b.section("Feature 4: Doko Mascot")
    b.p("The official 3D Nepali cultural mascot (डालो / डोको) wearing a Dhaka Topi and weaving bamboo baskets.")

    f4_headers = ["Aspect", "Technical Implementation Details"]
    f4_rows = [
        ["1. Source Files", "`client/src/components/DokoMascot.jsx`, `client/src/assets/images/mascot-doko.png`, `client/public/doko-animated.webm`"],
        ["2. Components", "`DokoMascot` component with video canvas layer, fallback image, speech bubble container, and floating emoji sparkles."],
        ["3. CSS Styling", "Inline CSS transitions with 3D transforms: `translateY(-14px) scale(1.05)` during jump; speech bubble with pointer triangle using CSS borders."],
        ["4. JS Logic", "`triggerJump` sets `isJumping = true`, picks a random encouragement phrase in Nepali/English, generates sparkle coordinates, and resets via `setTimeout`."],
        ["5. State Management", "`useState(isJumping)` controls physics transform; `useState(sparkles)` holds floating particle array; `useState(speechText)` holds speech bubble text."],
        ["6. Dependencies", "Pure React & HTML5 video (zero heavy external animation libraries)."],
        ["7. User Interactions", "Clicking or tapping Doko triggers a joyful jump, floating sparkles, and a Nepali health tip (e.g. 'Khana scan garihalnu hos!')."],
        ["8. How to Modify", "To add more phrases, edit the `phrases` array at line 67 in `client/src/components/DokoMascot.jsx`."]
    ]
    b.table(f4_headers, f4_rows, [110, 405])
    b.spacer(8)

    # ---------------------------------------------------------
    # FEATURE 5: SMART FOOD SCANNER
    # ---------------------------------------------------------
    b.section("Feature 5: Smart Food Scanner")
    b.p("Camera viewfinder utilizing WebRTC to capture meals, compress images client-side, and submit them to the AI analysis engine.")

    f5_headers = ["Aspect", "Technical Implementation Details"]
    f5_rows = [
        ["1. Source Files", "`client/src/pages/Scan.jsx`, `client/src/services/imageCompression.js`, `client/src/hooks/useNutrition.js`"],
        ["2. Components", "`Scan` component with camera preview `<video>`, scanning reticle frame, camera flip button, gallery file input, and capture trigger."],
        ["3. CSS Styling", "Full-screen camera viewport with dark overlay, centered target reticle, and glowing mint shutter button."],
        ["4. JS Logic", "`navigator.mediaDevices.getUserMedia` streams video. Capture draws current video frame to an off-screen `<canvas>`, compresses to JPEG, and sends FormData to backend."],
        ["5. State Management", "`cameraActive` boolean; `facingMode` ('environment' vs 'user'); `preview` data URL; `loading` indicator from `useNutrition`."],
        ["6. Dependencies", "`lucide-react` (Camera, Image, RotateCcw, Sparkles), `axios`."],
        ["7. User Interactions", "Tapping capture takes photo; tapping switch flips front/rear camera; tapping gallery uploads an existing photo; navigating to `/scan/result` on success."],
        ["8. How to Modify", "To adjust image compression quality or max dimensions, edit `maxWidth = 1280` or `quality = 0.75` in `client/src/services/imageCompression.js`."]
    ]
    b.table(f5_headers, f5_rows, [110, 405])
    b.page_break()

    # ---------------------------------------------------------
    # FEATURE 6: DOKO VIDEO ANIMATIONS
    # ---------------------------------------------------------
    b.section("Feature 6: Doko Video Animations")
    b.p("High-definition looping WebM and MP4 video layers integrated seamlessly into card containers without audio interference.")

    f6_headers = ["Aspect", "Technical Implementation Details"]
    f6_rows = [
        ["1. Source Files", "`client/public/doko-dance-card.mp4`, `client/public/doko-dance-card.webm`, `client/src/pages/Home.jsx`"],
        ["2. Components", "HTML5 `<video>` element with dual `<source>` tags for WebM (VP9 with alpha channel) and MP4 (H.264 fallback)."],
        ["3. CSS Styling", "`object-fit: cover; border-radius: 24px;` embedded inside responsive card containers with subtle box shadows."],
        ["4. JS Logic", "Attributes: `autoPlay`, `muted`, `loop`, `playsInline`. Poster image attribute provides instant visual render before video starts."],
        ["5. State Management", "Managed by native browser media engine; ref can pause/play on visibility change."],
        ["6. Dependencies", "HTML5 Video API."],
        ["7. User Interactions", "Seamless ambient video playback without user intervention; zero battery drain when card is off-screen."],
        ["8. How to Modify", "To change video dimensions, adjust the container height style in `Home.jsx` lines 1220-1240."]
    ]
    b.table(f6_headers, f6_rows, [110, 405])
    b.spacer(8)

    # ---------------------------------------------------------
    # FEATURE 7: TODAY'S SUMMARY
    # ---------------------------------------------------------
    b.section("Feature 7: Today's Summary (Calorie & Nutrition Card)")
    b.p("Visual gauge displaying total calories consumed against the daily target, accompanied by remaining calorie calculations.")

    f7_headers = ["Aspect", "Technical Implementation Details"]
    f7_rows = [
        ["1. Source Files", "`client/src/pages/Home.jsx` (Lines 800-950), `client/src/services/api.js` (`getProgressApi`)"],
        ["2. Components", "Circular progress bar / radial meter with central calorie readout and percentage badge."],
        ["3. CSS Styling", "CSS `@property --progress` custom variable enabling smooth CSS angle transitions in `conic-gradient` circles."],
        ["4. JS Logic", "Calculates `Math.round((calories / calorieGoal) * 100)` and `Math.max(0, calorieGoal - calories)` remaining."],
        ["5. State Management", "Updated dynamically when `summary` state updates from `getProgressApi('week')`."],
        ["6. Dependencies", "`lucide-react` icons."],
        ["7. User Interactions", "Visual feedback upon logging a new meal; updates calorie numbers instantaneously."],
        ["8. How to Modify", "To alter the circular ring stroke or color, edit the conic-gradient colors in `homeCss` in `Home.jsx`."]
    ]
    b.table(f7_headers, f7_rows, [110, 405])
    b.spacer(8)

    # ---------------------------------------------------------
    # FEATURE 8: CALORIE TRACKING
    # ---------------------------------------------------------
    b.section("Feature 8: Calorie Tracking Engine")
    b.p("The mathematical core calculating energy expenditure, logging meal history, and calculating nutritional streaks.")

    f8_headers = ["Aspect", "Technical Implementation Details"]
    f8_rows = [
        ["1. Source Files", "`server/controllers/nutritionController.js`, `client/src/data/streak.js`, `server/services/firestoreService.js`"],
        ["2. Components", "`FoodAnalysisResult.jsx` Track Meal button, `History.jsx` meal cards."],
        ["3. CSS Styling", "Calorie badges in `#1F4D33` with contrasting white typography and rounded pill styling."],
        ["4. JS Logic", "Calls `saveMealApi({ scanId })`. Server records meal under user ID, groups by date, and recalculates consecutive streak days."],
        ["5. State Management", "Server-backed in Cloud Firestore; cached in `localStorage` via `session.js`."],
        ["6. Dependencies", "Firebase Firestore SDK, Node.js crypto randomUUID."],
        ["7. User Interactions", "Tapping 'Track Meal' marks the scan as logged, increments streak, and updates Today's Summary."],
        ["8. How to Modify", "To change streak calculation logic (e.g. requiring at least 1,200 kcal to count), edit `dayCounts()` in `client/src/data/streak.js`."]
    ]
    b.table(f8_headers, f8_rows, [110, 405])
    b.spacer(8)

    # ---------------------------------------------------------
    # FEATURE 9: MACRONUTRIENT INDICATORS
    # ---------------------------------------------------------
    b.section("Feature 9: Macronutrient Indicators (Protein, Carbs, Fat)")
    b.p("Tri-color progress bars showing grams of Protein, Carbohydrates, and Fat consumed versus daily targets.")

    f9_headers = ["Aspect", "Technical Implementation Details"]
    f9_rows = [
        ["1. Source Files", "`client/src/pages/Home.jsx`, `client/src/pages/Progress.jsx`"],
        ["2. Components", "Three distinct macro meter bars with icon badges (Dumbbell for Protein, Wheat for Carbs, Droplet for Fat)."],
        ["3. CSS Styling", "Harmonious health palette: Protein = Mint Green (`#3FA47A`), Carbs = Soft Amber/Orange (`#E08E45`), Fat = Soft Sky Blue (`#4A90E2`)."],
        ["4. JS Logic", "Calculates percentage width `Math.min(100, (current / goal) * 100) + '%'`. Formats values as 'X / Yg'."],
        ["5. State Management", "Values derived from `summary.protein`, `summary.carbs`, `summary.fat` state."],
        ["6. Dependencies", "`lucide-react` (Dumbbell, Wheat, Droplet)."],
        ["7. User Interactions", "Displays progress smoothly; color bars expand horizontally via CSS transitions."],
        ["8. How to Modify", "To change the default macro targets, update `defaultSummary` in `Home.jsx` or edit targets in `/goals`."]
    ]
    b.table(f9_headers, f9_rows, [110, 405])
    b.spacer(8)

    # ---------------------------------------------------------
    # FEATURE 10: SEVEN-DAY MEAL PLANNER
    # ---------------------------------------------------------
    b.section("Feature 10: Seven-Day Meal Planner (AI-Generated)")
    b.p("Generates an AI personalized 7-day nutrition and recipe schedule based on the user's past scans and health goals.")

    f10_headers = ["Aspect", "Technical Implementation Details"]
    f10_rows = [
        ["1. Source Files", "`client/src/pages/MealPlanner.jsx`, `server/controllers/mealPlanController.js`, `server/services/geminiService.js`"],
        ["2. Components", "`MealPlanner` page, 7 daily collapsible cards (Monday to Sunday), calorie breakdown, and 'Regenerate Plan' button."],
        ["3. CSS Styling", "Accordion day cards with smooth expansion animations, meal tags (Breakfast, Lunch, Dinner, Snack), and health tips."],
        ["4. JS Logic", "`createMealPlan` inspects user health conditions and past 7 days of scanned meals, calling Gemini AI to generate custom meal days. Enforces a 3-day (72-hour) cooldown."],
        ["5. State Management", "Plan stored in Firestore `mealPlans/{userId}`; client manages `remainingMs` countdown timer state."],
        ["6. Dependencies", "Google Gemini 3.5 API (`@google/generative-ai`), Firebase Firestore."],
        ["7. User Interactions", "Tapping days expands meal recommendations; tapping Regenerate triggers AI plan synthesis when cooldown allows."],
        ["8. How to Modify", "To change the cooldown duration, edit `COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000` in `server/controllers/mealPlanController.js`."]
    ]
    b.table(f10_headers, f10_rows, [110, 405])
    b.page_break()

    # ---------------------------------------------------------
    # FEATURE 11: RECENT MEALS
    # ---------------------------------------------------------
    b.section("Feature 11: Recent Meals")
    b.p("Displays previously analyzed and tracked meals with photo thumbnails, calorie count, item breakdown, and timestamps.")

    f11_headers = ["Aspect", "Technical Implementation Details"]
    f11_rows = [
        ["1. Source Files", "`client/src/pages/Home.jsx`, `client/src/pages/History.jsx`, `client/src/components/FoodCard.jsx`"],
        ["2. Components", "`FoodCard` list items rendering thumbnail photo, meal title, timestamp, and macro breakdown pills."],
        ["3. CSS Styling", "Clean card with 18px border radius, subtle border `var(--kl-beige-deep)`, and flexbox layout."],
        ["4. JS Logic", "Fetches from `getHistoryApi()`. Maps over meal array. Date formatted via `Intl.DateTimeFormat` with Asia/Kathmandu timezone."],
        ["5. State Management", "`meals` array state; supports local deletion and filtering by date."],
        ["6. Dependencies", "`lucide-react` (ChevronRight, UtensilsCrossed)."],
        ["7. User Interactions", "Tapping a meal opens detailed item view in `ItemDetails.jsx`."],
        ["8. How to Modify", "To change how many meals are previewed on the Home screen, edit the `.slice(0, 3)` limit in `Home.jsx`."]
    ]
    b.table(f11_headers, f11_rows, [110, 405])
    b.spacer(8)

    # ---------------------------------------------------------
    # FEATURE 12: FEATURED PARTNERS (DOKO WHITEBOARD INTEGRATION)
    # ---------------------------------------------------------
    b.section("Feature 12: Featured Partners & Doko Whiteboard Integration")
    b.p("Integrates sponsor advertisements (Jiri Nutrition, MuscleBlaze, Nepal Organics, Kathmandu Fitness Hub) directly into the whiteboard held by the 3D Doko mascot.")

    f12_headers = ["Aspect", "Technical Implementation Details"]
    f12_rows = [
        ["1. Source Files", "`client/src/pages/Home.jsx`, `client/public/doko-sponsor-board.mp4`, `server/services/sponsorService.js`"],
        ["2. Components", "`.doko-sponsor-card` containing background video layer (`.doko-ad-video`), sliding carousel track, and whiteboard overlay (`.doko-whiteboard-content`)."],
        ["3. CSS Styling", "Strict 16:9 aspect ratio (`aspect-ratio: 16 / 9`); `.doko-whiteboard-content` positioned at `left: 6.8%; width: 53%; top: 7%; height: 85%` with `container-type: inline-size` for `cqw` responsive typography."],
        ["4. JS Logic", "Overlay content ends at `59.8%` horizontally, leaving full clearance for Doko's wing and crest (`64%`). Renders brand logo (`.doko-ad-logo`), brand name, sponsored badge, bold headline, compact product thumbnail (`.doko-ad-product-box`), and CTA button."],
        ["5. State Management", "Active slide tracked in `activeSlide` state; sponsors fetched from `getSponsorsApi()` with offline fallback in `Home.jsx`."],
        ["6. Dependencies", "`client/src/services/api.js`, `lucide-react` (ExternalLink)."],
        ["7. User Interactions", "Clicking anywhere on the board or CTA button opens partner website (`ad.destinationUrl`) in a new tab while recording click telemetry."],
        ["8. How to Modify", "To adjust whiteboard content width or position, edit `.doko-whiteboard-content` in `Home.jsx` around line 895."]
    ]
    b.table(f12_headers, f12_rows, [110, 405])
    b.spacer(8)

    # ---------------------------------------------------------
    # FEATURE 13: SPONSOR ADVERTISEMENTS & TELEMETRY
    # ---------------------------------------------------------
    b.section("Feature 13: Sponsor Advertisements & Telemetry")
    b.p("Monetization and partner ad engine with automated impression tracking and click redirection.")

    f13_headers = ["Aspect", "Technical Implementation Details"]
    f13_rows = [
        ["1. Source Files", "`server/controllers/sponsorController.js`, `server/services/sponsorService.js`, `server/routes/sponsorRoutes.js`"],
        ["2. Components", "Backend REST controller and database service."],
        ["3. CSS Styling", "N/A (Backend service)."],
        ["4. JS Logic", "GET `/api/sponsors` automatically increments impression count for each served ad. POST `/api/sponsors/:id/click` increments click counter."],
        ["5. State Management", "Sponsor campaign metrics stored in-memory in `sponsorService.js` with JSON persistence capability."],
        ["6. Dependencies", "Express.js routing."],
        ["7. User Interactions", "Implicit impression counting when viewing dashboard; explicit click tracking on tap."],
        ["8. How to Modify", "To create an admin dashboard for sponsors, connect the existing admin routes in `server/routes/sponsorRoutes.js`."]
    ]
    b.table(f13_headers, f13_rows, [110, 405])
    b.spacer(8)

    # ---------------------------------------------------------
    # FEATURE 14: AUTOMATIC ADVERTISEMENT CAROUSEL (3-SECOND ROTATION)
    # ---------------------------------------------------------
    b.section("Feature 14: Automatic Advertisement Carousel (3-Second Interval)")
    b.p("Horizontally sliding banner carousel rotating automatically every 3 seconds, pausing on hover or touch, with smooth CSS transforms.")

    f14_headers = ["Aspect", "Technical Implementation Details"]
    f14_rows = [
        ["1. Source Files", "`client/src/pages/Home.jsx` (Lines 1335-1350, 1925-2045)"],
        ["2. Components", "`.doko-carousel-track` sliding container, `.doko-slide-wrapper` slide frames, and pagination dot indicators."],
        ["3. CSS Styling", "CSS `transform: translateX(-X%)` with `transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)`; active pagination dot expands smoothly."],
        ["4. JS Logic", "`setInterval` in `resetAutoplayTimer` advances slides every 3000ms. Touch handlers (`onTouchStart`, `onTouchMove`, `onTouchEnd`) detect 40px swipe delta. Mouse enter/leave pauses and resumes."],
        ["5. State Management", "`activeSlide` state integer; `autoplayTimerRef` dedicated interval ref; `isHoveredRef` and `isInteractingRef` flags."],
        ["6. Dependencies", "Pure React & native DOM touch event APIs."],
        ["7. User Interactions", "Swiping left/right changes slides; tapping dots jumps to specific slide; hovering pauses the timer; clicking opens destination URL."],
        ["8. How to Modify", "To change rotation interval, edit the `3000` duration in `resetAutoplayTimer` in `Home.jsx` line 1344."]
    ]
    b.table(f14_headers, f14_rows, [110, 405])
    b.spacer(8)

    # ---------------------------------------------------------
    # FEATURE 15: BOTTOM NAVIGATION
    # ---------------------------------------------------------
    b.section("Feature 15: Bottom Navigation Bar")
    b.p("The floating mobile navigation bar featuring a raised Scan button, scroll-direction hide/show physics, and React Portal rendering.")

    f15_headers = ["Aspect", "Technical Implementation Details"]
    f15_rows = [
        ["1. Source Files", "`client/src/components/BottomNav.jsx`"],
        ["2. Components", "`BottomNav` rendering 5 tabs: Home, Progress, Scan, History, Profile via `createPortal(..., document.body)`."],
        ["3. CSS Styling", "Floating pill with `position: fixed; bottom: 20px; z-index: 9999;`, cream glassmorphism, and raised circular center Scan button."],
        ["4. JS Logic", "`getScrollY()` listener detects scroll delta. Scrolling down hides navbar (`translateY(120%)`); scrolling up immediately reveals it. Keyboard focus suppresses hiding."],
        ["5. State Management", "`isVisible` boolean state; `lastYRef` scroll position ref; `currentTab` derived from `useLocation().pathname`."],
        ["6. Dependencies", "`react-dom` (createPortal), `react-router-dom` (Link, useLocation), `lucide-react`."],
        ["7. User Interactions", "Tapping tabs navigates seamlessly; scrolling page hides navbar to maximize reading room."],
        ["8. How to Modify", "To add a new navigation tab, add an entry to the `TABS` array in `client/src/components/BottomNav.jsx`."]
    ]
    b.table(f15_headers, f15_rows, [110, 405])
    b.spacer(8)

    # ---------------------------------------------------------
    # FEATURE 16: CULTURAL AVATAR SELECTION SYSTEM
    # ---------------------------------------------------------
    b.section("Feature 16: Cultural Avatar Selection System")
    b.p("Interactive avatar selection grid offering 32 culturally authentic Nepali/Asian person avatars sliced from a master sprite sheet.")

    f16_headers = ["Aspect", "Technical Implementation Details"]
    f16_rows = [
        ["1. Source Files", "`client/src/components/AvatarPicker.jsx`, `client/slice_avatars.py`, `client/src/components/FoodAvatar.jsx`, `client/src/assets/avatars/`"],
        ["2. Components", "`AvatarPicker` modal grid, `Avatar` circular display, and `FoodAvatar` fallback badge."],
        ["3. CSS Styling", "Responsive 4-column modal grid, subtle green highlight ring on selected avatar, and smooth scale hover transitions."],
        ["4. JS Logic", "`slice_avatars.py` uses PIL to slice 32 180x180 high-res avatars from master grid. `AvatarPicker` manages selection, writes to `localStorage`, and emits a custom `avatar-updated` window event."],
        ["5. State Management", "`selectedAvatar` string path stored in user profile and synchronized across browser tabs."],
        ["6. Dependencies", "Python PIL (build-time slicing), React state."],
        ["7. User Interactions", "Tapping avatar in header or profile opens picker modal; tapping any character updates user avatar immediately across the entire app."],
        ["8. How to Modify", "To add more avatars, place new images in `client/src/assets/avatars/` and update the avatar list in `AvatarPicker.jsx`."]
    ]
    b.table(f16_headers, f16_rows, [110, 405])
    b.page_break()
