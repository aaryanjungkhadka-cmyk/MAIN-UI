# chapters_17_roadmap.py - Chapter 17: Known Issues, Incomplete Implementations & Future Roadmap
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, PageBreak
from .styles import escape_xml

def build_chapters_17_roadmap(b):
    styles = b.styles

    # =========================================================
    # CHAPTER 17: KNOWN ISSUES & FUTURE ROADMAP
    # =========================================================
    b.chapter_banner(
        "17",
        "Known Issues, Incomplete Features, and Future Roadmap",
        "Transparent engineering audit of real-world edge cases, simulated systems, and the strategic technical roadmap"
    )

    b.p(
        "Honest, transparent self-auditing is the hallmark of a mature software engineering organization. "
        "No production application is ever 100% finished. This chapter provides a complete breakdown of current known technical issues, "
        "identifies simulated or mock implementations that require live cloud credentials, and outlines a clear multi-phase technical roadmap "
        "for scaling KhanaLens to thousands of daily active users."
    )
    b.spacer(6)

    # ---------------------------------------------------------
    # 17.1 KNOWN ISSUES & EDGE CASES
    # ---------------------------------------------------------
    b.section("17.1 Known Technical Issues & Edge Cases")
    b.p(
        "Through rigorous cross-device testing across iOS Safari, Android Chrome, and desktop viewports, "
        "the following technical edge cases and platform limitations were cataloged:"
    )

    issues_headers = ["Issue / Edge Case", "Affected Platforms", "Underlying Technical Cause", "Current Mitigation & Workaround"]
    issues_rows = [
        [
            "1. 48MP Photo Upload Payload Limit (HTTP 413)",
            "iOS & High-End Android Phones",
            "Modern smartphone cameras capture 48-108 megapixel uncompressed images exceeding 12MB. Vercel serverless functions enforce a strict 4.5MB request body ceiling.",
            "Client-side Canvas downsampling in `imageCompression.js` resizes images to max 1280px width and 0.75 JPEG quality before upload, keeping payloads under 800KB."
        ],
        [
            "2. Mobile Safari Low-Power Autoplay Policy",
            "iOS Safari (Low Power Mode)",
            "iOS strictly pauses all background and looping HTML5 `<video>` elements when the device battery drops below 20% or Low Power Mode is enabled.",
            "Supplied high-resolution poster images (`doko-sponsor-board-poster.jpg`, `doko-landing-hero-poster.jpg`) so the card displays a beautiful still graphic if video pauses."
        ],
        [
            "3. Google Gemini Free-Tier Rate Limits (HTTP 429)",
            "Backend AI Service",
            "Google Gemini 1.5/2.5 Flash free-tier API keys enforce a limit of 15 Requests Per Minute (RPM) and 1,500 Requests Per Day.",
            "Engineered a server-side 72-hour cooldown timer on Meal Plan synthesis and implemented strict input validation to prevent duplicate scan requests."
        ],
        [
            "4. WebRTC Multi-Lens Switching Bugs",
            "Triple-Camera Android Phones",
            "Some Android devices label their ultra-wide or macro sensor as 'environment', causing camera viewfinders to open in 0.5x ultra-wide magnification.",
            "Switched constraints to `{ ideal: 'environment' }` with a manual front/rear toggle button allowing users to switch lenses explicitly."
        ],
        [
            "5. UTC Midnight Date Shift",
            "Users in Nepal Timezone (UTC+5:45)",
            "Calling `.toISOString().split('T')[0]` converts local time to UTC. Meals logged between 12:00 AM and 5:45 AM local time were assigned to yesterday's date.",
            "Refactored date formatting to use `Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kathmandu' })` or local `getFullYear()` math."
        ]
    ]
    b.table(issues_headers, issues_rows, [95, 95, 155, 170])
    b.spacer(8)

    # ---------------------------------------------------------
    # 17.2 INCOMPLETE & SIMULATED IMPLEMENTATIONS
    # ---------------------------------------------------------
    b.section("17.2 Incomplete & Simulated Implementations")
    b.p(
        "To deliver a smooth user experience during development before enterprise contracts were signed, "
        "several features operate using production-ready UI flows backed by local simulation or dual-mode memory stores:"
    )

    sim_headers = ["Feature", "Current Implementation State", "What Works Today?", "What Is Needed for Full Production?"]
    sim_rows = [
        [
            "eSewa & Khalti Payments",
            "UI Prototype / Simulated Checkout",
            "Full plan selection, vector payment logos, promo code validation, and simulated instant success screen.",
            "Merchant KYC registration with eSewa (epay.esewa.com.np) and Khalti (khalti.com/api), and server-side secret key hash validation in `paymentController.js`."
        ],
        [
            "Push Notifications",
            "Client Local State",
            "Interactive notification center with tab filtering (All, Meals, System) and 'Mark all as read'.",
            "Registration of a Service Worker (`sw.js`) and integration with Firebase Cloud Messaging (FCM) or Web Push VAPID keys for remote lockscreen push alerts."
        ],
        [
            "Cloud Firestore Database",
            "Dual-Mode (Cloud + In-Memory Fallback)",
            "Full CRUD meal history and profile management works out of the box in memory (`inMemoryNutritionStore.js`).",
            "Generating and deploying a real `serviceAccountKey.json` from the Firebase Console to enable multi-device persistent cloud storage."
        ],
        [
            "Offline AI Food Scanning",
            "Online Cloud-Dependent",
            "Fast, accurate multimodal recognition of South Asian and Nepali dishes via Google Gemini cloud servers.",
            "Exporting a lightweight quantized TensorFlow Lite / MobileNet model running locally on-device via WebAssembly for zero-connectivity scanning in remote trails."
        ]
    ]
    b.table(sim_headers, sim_rows, [90, 105, 150, 170])
    b.spacer(8)

    # ---------------------------------------------------------
    # 17.3 FUTURE TECHNICAL ROADMAP
    # ---------------------------------------------------------
    b.section("17.3 Future Technical Roadmap & Architecture Improvements")
    b.p(
        "The following multi-phase technical roadmap details the architectural evolution planned for KhanaLens:"
    )

    b.subsection("Phase 1: Performance & PWA Offline Enhancements (Q1 2027)")
    b.bullet("<b>Service Worker Caching:</b> Implement `workbox-window` to cache app shell assets, fonts, and the Doko video locally, achieving instantaneous sub-100ms offline load times.")
    b.bullet("<b>IndexedDB Client Cache:</b> Replace `localStorage` with `idb` for client-side storage, allowing users to store hundreds of meal photos offline without the 5MB browser storage quota limit.")

    b.subsection("Phase 2: Nepali Localization & Voice Logging (Q2 2027)")
    b.bullet("<b>Voice Food Logging:</b> Integrate Web Speech API and Whisper AI to allow users to speak meal descriptions in Nepali (e.g. 'Dui ota boiled anda ra euta apple khaye') and automatically extract macros.")
    b.bullet("<b>Bilingual Nepali UI:</b> Expand `LanguageContext.jsx` to provide complete Nepali Devanagari translation across all 18 pages with one-tap toggle in `AppHeader.jsx`.")

    b.subsection("Phase 3: Community & Health Portal Integration (Q3 2027)")
    b.bullet("<b>Packaged Food Barcode Scanning:</b> Integrate `html5-qrcode` to scan EAN-13 barcodes on packaged Nepali foods (Wai Wai, Real Juice, Amul, Nebico) directly against an Open Food Facts database.")
    b.bullet("<b>Doctor & Dietitian Export:</b> One-click export of 30-day nutrition history, macro compliance percentages, and weight progression into a standardized PDF report for medical consultations.")

    b.callout(
        "Continuous Architecture Philosophy: Software is never carved in stone; it is living systems code. "
        "Every feature you have studied in this handbook—from Doko's canvas physics to Gemini AI food analysis—was "
        "designed with clean abstraction boundaries, making future upgrades straightforward to author and deploy.",
        title="CLOSING ARCHITECTURAL PRINCIPLE",
        kind="tip"
    )

    b.page_break()
