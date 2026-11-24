# chapters_9_to_11.py - Chapters 9, 10, and 11
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, PageBreak
from .styles import escape_xml

def build_chapters_9_to_11(b):
    styles = b.styles

    # =========================================================
    # CHAPTER 9: ANIMATION AND MEDIA DEVELOPMENT
    # =========================================================
    b.chapter_banner(
        "9",
        "Animation and Media Development",
        "Mastering CSS keyframes, video backgrounds, WebM alpha transparency, image compression, and Doko physics"
    )

    b.section("9.1 CSS Animations vs Transitions vs JavaScript Physics")
    b.p(
        "Animations bring life and personality to an application. In KhanaLens, animations range from subtle micro-interactions "
        "to full-screen ambient video playback:"
    )
    b.bullet("<b>CSS Transitions:</b> Smoothly animates a property between two states when triggered by a class or pseudo-class (e.g. `transition: transform 0.2s ease`). Used for button clicks, carousel slides, and tab switches.")
    b.bullet("<b>CSS Keyframes (`@keyframes`):</b> Complex multi-step animations that run continuously or trigger on mount without user action (e.g. `@keyframes pulse-soft` in `Home.jsx`).")
    b.bullet("<b>JavaScript Physics:</b> Calculations that update coordinates dynamically (e.g. Doko's joyful jump and random particle sparkles in `DokoMascot.jsx`).")

    b.section("9.2 Media Formats Compared: GIF vs Lottie vs MP4 vs WebM")
    b.p(
        "A critical architectural choice in KhanaLens was avoiding outdated, heavy media formats in favor of modern streaming video:"
    )

    media_headers = ["Media Format", "Transparency?", "File Size & Compression", "Pros & Cons", "Used in KhanaLens?"]
    media_rows = [
        [
            "GIF",
            "1-bit (Jagged edges)",
            "Terrible (15MB+ for 3 seconds of animation; 256 color limit).",
            "Outdated; crashes mobile memory; looks pixelated on Retina screens.",
            "NEVER USED."
        ],
        [
            "Lottie (JSON)",
            "Yes (Vector)",
            "Extremely small (50KB vector JSON).",
            "Fantastic for vector line icons; cannot render realistic 3D photorealistic characters.",
            "Great for future vector icons."
        ],
        [
            "MP4 (H.264)",
            "No native alpha channel",
            "High compression (1-3MB for 1080p video).",
            "Plays natively on every device (iOS, Android, Windows, Mac). Excellent battery efficiency.",
            "YES (`doko-animated.mp4`, `doko-landing-hero.mp4`)."
        ],
        [
            "WebM (VP9)",
            "YES! Full 8-bit Alpha Channel",
            "Superior compression (half the size of MP4 with transparent background).",
            "Allows Doko character to weave bamboo baskets directly over the cream app background without a white box!",
            "YES! (`doko-animated.webm`, `doko-dance-card.webm`)."
        ]
    ]
    b.table(media_headers, media_rows, [80, 85, 120, 150, 80])

    b.section("9.3 Mobile Video Background Rules: Autoplay, Muted & Low-Power Mode")
    b.p(
        "Why do video backgrounds fail on mobile browsers? Modern iOS Safari and Android Chrome enforce strict anti-annoyance policies: "
        "video will <b>refuse to play</b> unless four exact conditions are met in your JSX:"
    )

    video_code = """{/* Real Video Pattern from LandingPage.jsx and Home.jsx */}
<video
  ref={videoRef}
  autoPlay          /* Required: Starts playback automatically */
  muted             /* REQUIRED: Video MUST be silent or mobile will block it! */
  loop              /* Required: Continuously replays without stutter */
  playsInline       /* REQUIRED: Prevents iOS from forcing video to full-screen */
  poster={dokoHeroPoster} /* REQUIRED: Shows instant image while video downloads */
  className="hero-video"
>
  <source src="/doko-animated.webm" type="video/webm" />
  <source src="/doko-animated.mp4" type="video/mp4" />
</video>"""
    b.code_block(video_code, filename="client/src/pages/LandingPage.jsx", title="Production Video Background Template")

    b.section("9.4 Client-Side Image Compression: imageCompression.js")
    b.p(
        "Modern smartphones capture photos at 12 to 48 megapixels (5MB to 20MB per photo). If a user uploads an uncompressed photo "
        "over a 4G connection in Nepal: (1) upload takes 15 seconds, (2) server memory spikes, and (3) Gemini API request limits are exceeded."
    )
    b.p(
        "To solve this, `client/src/services/imageCompression.js` intercepts the photo, loads it into an in-memory HTML5 `<canvas>`, "
        "resizes the maximum dimension to 1280px, and re-encodes it as a 0.75 quality JPEG. File size drops from 12MB to 350KB in 80 milliseconds!"
    )

    b.exercise_box("Chapter 9: Animation & Media", [
        "Why is `playsInline` strictly required on iOS Safari when embedding video backgrounds?",
        "What is the difference between MP4 and WebM? Why does KhanaLens use WebM for the floating Doko mascot?",
        "In `imageCompression.js`, how does drawing an image to an HTML5 `<canvas>` allow developers to compress file sizes?"
    ])
    b.page_break()

    # =========================================================
    # CHAPTER 10: FRONTEND ARCHITECTURE & CODE ORGANIZATION
    # =========================================================
    b.chapter_banner(
        "10",
        "Frontend Architecture & Code Organization",
        "Component-based architecture, folder design, separation of concerns, and refactoring strategies"
    )

    b.section("10.1 Component-Based Architecture")
    b.p(
        "Before modern frontend frameworks, websites were organized by file type: one giant `scripts.js` file, one `styles.css` file, "
        "and dozens of HTML pages. Modifying a button meant searching through 5,000 lines of CSS."
    )
    b.p(
        "KhanaLens uses <b>Component-Based Architecture</b>. A component is an encapsulated unit of code containing its own markup, "
        "internal state, and visual styling. Components can be composed like Lego bricks to build complex pages:"
    )

    comp_ascii = """              [App.jsx] (Routing & Auth Guards)
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
    [MainLayout]            [LandingPage]
         │
    ┌────┴───────────────────────────┐
    ▼                                ▼
[AppHeader]                     [Home.jsx]
    │                                │
    ├─ Avatar.jsx                    ├─ DokoMascot.jsx
    └─ LanguageContext               ├─ Macro Progress Gauges
                                     ├─ Sponsor Carousel
                                     └─ BottomNav.jsx (Portal)"""
    b.diagram_box("KhanaLens Component Hierarchy", comp_ascii)

    b.section("10.2 Separation of Concerns in KhanaLens")
    b.p(
        "To maintain clean code, KhanaLens enforces strict separation between different layers of the frontend:"
    )
    b.bullet("<b>Components (`client/src/components/`):</b> Dumb or focused presentation widgets (e.g. `BrandLogo.jsx`, `Avatar.jsx`). They receive props and render UI.")
    b.bullet("<b>Pages (`client/src/pages/`):</b> Screen-level views that orchestrate multiple components and tie into routes (e.g. `Home.jsx`, `Scan.jsx`).")
    b.bullet("<b>Services (`client/src/services/`):</b> Network and third-party logic (e.g. `api.js`, `firebaseAuth.js`). Components should NEVER call raw `fetch()` directly; they always call clean service functions!")
    b.bullet("<b>Hooks (`client/src/hooks/`):</b> Reusable stateful logic (e.g. `useNutrition.js`, `useAuth.js`).")
    b.bullet("<b>Context (`client/src/context/`):</b> Shared application-wide state (e.g. current user session, active language).")

    b.section("10.3 Refactoring Opportunities: Decomposing Large Files")
    b.callout(
        "Architectural Growth Area: If you inspect `client/src/pages/Home.jsx`, it currently spans over 2,000 lines of code! "
        "It contains the header, macro summary, carousel, Doko mascot, recent meals, sponsor ads, and embedded CSS strings. "
        "While it functions smoothly, senior engineers would refactor `Home.jsx` into separate smaller files: "
        "`TodaySummaryCard.jsx`, `SponsorCarousel.jsx`, and `RecentMealsSection.jsx`. "
        "This makes files easier to read, test, and maintain without breaking existing features!",
        title="CODE QUALITY RECOMMENDATION",
        kind="tip"
    )

    b.exercise_box("Chapter 10: Architecture & Organization", [
        "Why is it bad practice to write raw `fetch()` or `axios` calls directly inside a UI component?",
        "If you create a new reusable button component, which folder in `client/src` should it live in?",
        "How would splitting `Home.jsx` into smaller component files prevent accidental merge conflicts when working with a team?"
    ])
    b.page_break()

    # =========================================================
    # CHAPTER 11: BACKEND AND DATABASE FUNDAMENTALS
    # =========================================================
    b.chapter_banner(
        "11",
        "Backend and Database Fundamentals",
        "Node.js, Express REST APIs, HTTP protocols, JWT/Firebase security, and Cloud Firestore data modeling"
    )

    b.section("11.1 The Backend Runtime: Node.js and Express.js")
    b.p(
        "Historically, JavaScript could only run inside web browsers. In 2009, Ryan Dahl created <b>Node.js</b>, which extracted "
        "Google Chrome's V8 JavaScript engine and allowed it to run directly on computer operating systems (servers). "
        "<b>Express.js</b> is the fast, minimalist web framework layered on top of Node.js that handles incoming HTTP web requests."
    )

    b.section("11.2 Understanding REST APIs & HTTP Verbs")
    b.p(
        "A <b>REST API (Representational State Transfer)</b> is an architectural standard where client and server exchange data "
        "using standard HTTP protocols and JSON payloads:"
    )

    http_headers = ["HTTP Method", "CRUD Equivalent", "Idempotent?", "KhanaLens Real Example", "Endpoint"]
    http_rows = [
        ["`GET`", "Read", "Yes", "Fetch weekly nutrition progress summary.", "`GET /api/nutrition/progress`"],
        ["`POST`", "Create", "No", "Upload a food photo buffer for AI analysis.", "`POST /api/nutrition/scan`"],
        ["`PUT`", "Full Update / Replace", "Yes", "Save complete user health profile & goals.", "`PUT /api/profile`"],
        ["`PATCH`", "Partial Update", "No", "Update only the user avatar choice.", "`PATCH /api/profile/avatar`"],
        ["`DELETE`", "Delete / Remove", "Yes", "Delete an active sponsor campaign.", "`DELETE /api/sponsors/:id`"]
    ]
    b.table(http_headers, http_rows, [70, 75, 75, 165, 130])

    b.section("11.3 Authentication & Authorization: Securing the API")
    b.p(
        "How does the server know who is making an API request? KhanaLens uses Bearer Token authorization. "
        "When the user logs in via Firebase on the client, Firebase gives the browser a cryptographically signed <b>JWT (JSON Web Token)</b>. "
        "On every subsequent API call, `client/src/services/api.js` attaches this token to the HTTP header:\n"
        "`Authorization: Bearer eyJhbGciOiJSUzI1NiIs...`"
    )
    b.p(
        "On the backend, `server/middleware/authMiddleware.js` intercepts the request. In a brilliant architectural pattern, "
        "if Firebase Admin private keys are not supplied, the middleware automatically queries Google's public x509 certificates "
        "(`https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com`) to verify the token's RS256 signature!"
    )

    b.section("11.4 Cloud Firestore Database Architecture")
    b.p(
        "KhanaLens uses Google Cloud Firestore, a scalable NoSQL cloud document database. Data is organized into <b>Collections</b> "
        "(folders) containing <b>Documents</b> (JSON-like records):"
    )

    db_ascii = """CLOUD FIRESTORE ROOT
├── profiles/                 # Collection: User Health Profiles
│   └── [userId]              # Document: { name, age, height, calorieGoal, avatar, conditions }
│
├── scans/                    # Collection: Raw AI Scan Analysis Cache
│   └── [scanId]              # Document: { userId, mealName, items: [...], totalKcal, createdAt }
│
├── meals/                    # Collection: Tracked & Confirmed User Meals
│   └── [userId]_[scanId]     # Document: { userId, scanId, tracked: true, savedAt, totals }
│
└── mealPlans/                # Collection: 7-Day AI Meal Plans
    └── [userId]              # Document: { days: [...], generatedAt, sourceMeals, recommendation }"""
    b.diagram_box("Cloud Firestore Data Hierarchy", db_ascii)

    b.callout(
        "Dual-Mode Resilience Architecture: Open `server/services/inMemoryNutritionStore.js`. "
        "If Firestore is offline or API credentials are not yet configured in `.env`, the server doesn't crash! "
        "It stores meal logs and streaks in a JavaScript `Map()` in server memory. This ensures you can develop "
        "and test KhanaLens on an airplane or without internet connectivity!",
        title="PATENT-GRADE RESILIENCE",
        kind="tip"
    )

    b.exercise_box("Chapter 11: Backend & Database", [
        "In `server/middleware/authMiddleware.js`, what does `req.headers.authorization` contain?",
        "Why is NoSQL document storage (Firestore) well-suited for food analysis where each meal can have a variable number of detected ingredients?",
        "What is the difference between Authentication ('Who are you?') and Authorization ('What are you permitted to do?')?"
    ])
    b.page_break()
