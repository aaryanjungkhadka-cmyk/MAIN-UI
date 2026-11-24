# chapters_1_to_3.py - Chapters 1, 2, and 3
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, PageBreak
from .styles import escape_xml

def build_chapters_1_to_3(b):
    styles = b.styles

    # =========================================================
    # CHAPTER 1: INTRODUCTION TO SOFTWARE DEVELOPMENT
    # =========================================================
    b.chapter_banner(
        "1",
        "Introduction to Software Development",
        "Demystifying how applications are planned, built, tested, and maintained"
    )

    b.section("1.1 What Is Software Development?")
    b.p(
        "At its core, <b>software development</b> is the systematic process of conceiving, designing, programming, "
        "documenting, testing, and bug fixing involved in creating and maintaining applications, frameworks, or other "
        "software components. In simple words: it is taking a human idea or problem and translating it into a set of "
        "logical instructions that computers, phones, and cloud servers can execute reliably."
    )

    b.callout(
        "The Smart Himalayan Restaurant Analogy: Imagine opening a modern restaurant in Kathmandu.\n\n"
        "1. The Dining Room & Menu = The Frontend. It is the visible decor, table lighting, printed menu, "
        "and physical plates the guest sees and interacts with. If the menu is confusing or the lighting flickers, "
        "guests leave.\n\n"
        "2. The Waiter = The REST API. The guest doesn't walk into the kitchen to grab food; they tell the waiter "
        "their order. The waiter carries the order slip to the kitchen and brings back the cooked meal.\n\n"
        "3. The Kitchen & Chefs = The Backend Server. Here, raw ingredients are sliced, seasoned, and cooked "
        "following strict recipes (business logic). The customer never sees the stoves, but without them, no meal exists.\n\n"
        "4. The Cold Storage Pantry = The Database. The spices, rice, and fresh vegetables are stored neatly on labeled "
        "shelves. Whenever a recipe needs dal or momo wrappers, the chef retrieves it from storage and puts leftover "
        "ingredients back in their exact containers.",
        title="REAL-WORLD MENTAL MODEL",
        kind="tip"
    )

    b.section("1.2 The Ten Stages of the Software Development Lifecycle (SDLC)")
    b.p(
        "Professional software is rarely built in one single burst of coding. Instead, it follows a structured lifecycle. "
        "Here is how KhanaLens traversed each of the 10 stages:"
    )

    stages_headers = ["Phase", "What Happens in this Stage?", "How It Applied to KhanaLens"]
    stages_rows = [
        [
            "1. Product Planning",
            "Defining the problem, user audience, core value proposition, and MVP (Minimum Viable Product).",
            "Identified that South Asian & Nepali diets lack accessible visual macro tracking. Scoped MVP to camera scanning, macro summaries, and 7-day plans."
        ],
        [
            "2. UI/UX Design",
            "Designing user flows, screen wireframes, color psychology, and mobile ergonomics.",
            "Created `docs/design.md` establishing the #1F4D33 forest green & cream palette, rounded 24px cards, bottom navigation, and Doko cultural mascot."
        ],
        [
            "3. Frontend Development",
            "Building interactive screens, buttons, animations, and forms that run in the user's browser.",
            "Constructed React 19 single-page application (`client/src/pages/`) with responsive mobile framing (`.kl-app-frame`) and Lucide icon systems."
        ],
        [
            "4. Backend Development",
            "Writing the server application to handle business rules, secure credentials, and data validation.",
            "Created Node.js + Express REST API (`server/controllers/`), routing endpoints, image parsing middleware (Multer), and Gemini prompt logic."
        ],
        [
            "5. Database Development",
            "Structuring data schemas, collections, indexes, and persistence layers.",
            "Modeled Cloud Firestore collections (`profiles`, `scans`, `meals`, `mealPlans`) with timestamps and created in-memory fallback stores."
        ],
        [
            "6. Third-Party Integration",
            "Connecting external APIs, artificial intelligence, and authentication providers.",
            "Integrated Google Gemini 3.5 Flash-Lite for structured food identification and Firebase Authentication for Google popup sign-in."
        ],
        [
            "7. Quality Assurance (Testing)",
            "Testing across devices, checking camera hardware access, validating error responses.",
            "Tested WebRTC camera streams across HTTPS and iOS Safari; verified 413 Payload Too Large limits and added image canvas downscaling."
        ],
        [
            "8. Deployment",
            "Packaging code and hosting it on public edge servers with custom domains and SSL encryption.",
            "Configured Vercel deployment with `vercel.json` monorepo routing, static edge hosting for client, and serverless bridges in `api/index.js`."
        ],
        [
            "9. Maintenance & Monitoring",
            "Tracking runtime bugs, monitoring API quotas, handling user feedback, releasing patches.",
            "Added 3-day cooldown timer to MealPlanner to prevent Gemini quota exhaustion; created fallback sponsor arrays when database is cold."
        ],
        [
            "10. Product Evolution",
            "Iterating based on data: adding partner sponsorships, streak habits, and monetization.",
            "Implemented Doko dancing video cards, Nepali payment gateway UI (eSewa/Khalti), and partner telemetry impression tracking."
        ]
    ]
    b.table(stages_headers, stages_rows, [85, 185, 245])

    b.callout(
        "Why Many Beginners Fail: The most common beginner trap is attempting to write code before planning "
        "the user flow or data shape. When you write code without knowing what the database or screen requires, "
        "you end up rewriting the same component ten times. Always plan your screens and data contracts first!",
        title="BEGINNER TRAP TO AVOID",
        kind="warning"
    )

    b.exercise_box("Chapter 1: The Software Lifecycle", [
        "In your own words, explain the difference between what a user sees (Frontend) and what happens on the server (Backend).",
        "Look at `docs/design.md` in your repository. Identify 3 design rules that were decided during Phase 2 before coding began.",
        "Why did KhanaLens implement a 3-day cooldown on the 7-day meal plan generator? Which SDLC phase (Testing/Maintenance) discovered this need?"
    ])
    b.page_break()

    # =========================================================
    # CHAPTER 2: UNDERSTANDING KHANALENS ARCHITECTURE
    # =========================================================
    b.chapter_banner(
        "2",
        "Understanding KhanaLens Architecture",
        "How the client, server, database, AI, and network communicate in harmony"
    )

    b.section("2.1 High-Level Architecture: Client vs Server")
    b.p(
        "KhanaLens is built using a <b>Client-Server Architecture</b>. The 'Client' is the code running inside your user's "
        "web browser (Chrome, Safari, Firefox). The 'Server' is a central computer running in the cloud (Node.js on Vercel or Render) "
        "that remains on 24 hours a day, waiting for instructions."
    )
    b.p(
        "Why don't we do everything on the client? Two vital reasons: <b>Security</b> and <b>Power</b>. "
        "If you put your Google Gemini API key or database private keys into the frontend React code, any user can right-click, "
        "inspect the source code, steal your API key, and run up thousands of dollars on your credit card. "
        "By keeping keys on the backend server, the secret keys never touch the user's phone."
    )

    b.section("2.2 The Complete Request-Response Lifecycle: Scanning a Plate of Food")
    b.p(
        "To truly understand your application, trace what happens under the hood when a user taps 'Capture' on a plate of Dal Bhat:"
    )

    scan_flow_ascii = """[STEP 1: USER DEVICE]
User points phone camera at plate of food and taps 'Scan' in Scan.jsx.
   │
   ▼
[STEP 2: CLIENT COMPRESSION]
imageCompression.js resizes the 12MP camera photo to max 1280px width
and compresses JPEG quality to 0.75, keeping file size under 600KB.
   │
   ▼
[STEP 3: NETWORK TRANSMISSION]
axios sends an HTTP POST request to '/api/nutrition/scan' with
Authorization: Bearer <Firebase_ID_Token> and multipart/form-data.
   │
   ▼
[STEP 4: BACKEND AUTHENTICATION]
server/middleware/authMiddleware.js intercepts the request, verifies
the Firebase token using Google's public RS256 keys, and attaches req.user.
   │
   ▼
[STEP 5: AI NUTRITION ANALYSIS]
server/services/geminiService.js sends the image buffer to Google Gemini 3.5
Flash-Lite with a strict JSON schema and user health profile constraints.
   │
   ▼
[STEP 6: DATABASE PERSISTENCE]
server/services/firestoreService.js saves the scan object to Cloud Firestore
'scans' collection with a server timestamp (or inMemoryNutritionStore fallback).
   │
   ▼
[STEP 7: JSON RESPONSE & UI RENDER]
Server sends HTTP 200 with structured JSON to React.
Scan.jsx receives payload and navigates to FoodAnalysisResult.jsx,
displaying calories, protein bars, and detected ingredients!"""

    b.diagram_box("End-to-End Scan Request Lifecycle", scan_flow_ascii)
    b.spacer(6)

    b.section("2.3 Monolithic vs Microservices vs Monorepo: Why KhanaLens Uses a Monorepo")
    b.p(
        "You may hear software engineers debate software architectures. Here is how they compare, and why KhanaLens's "
        "choice is ideal for rapid development:"
    )

    arch_headers = ["Architecture Pattern", "How It Works", "Pros", "Cons", "Does KhanaLens Use It?"]
    arch_rows = [
        [
            "Traditional Monolith",
            "Frontend and backend are bundled into one single monolithic application server (e.g. Django, Rails, PHP).",
            "Simple single deployment; easy for small projects.",
            "Frontend cannot easily be deployed separately to CDNs; difficult to scale independent parts.",
            "No. KhanaLens decouples client and server."
        ],
        [
            "Microservices",
            "The backend is split into 10+ tiny separate servers (Auth Service, Scan Service, Billing Service).",
            "Huge teams can work independently on different micro-servers.",
            "Massive operational complexity, high cloud hosting costs, networking latency, difficult debugging.",
            "No. Extreme overkill for KhanaLens."
        ],
        [
            "Monorepo Architecture",
            "Both `client/` and `server/` live inside one single Git repository, but have distinct `package.json` files and build steps.",
            "Single Git history, shared types, unified npm scripts (`concurrently`), seamless deployment to Vercel.",
            "Requires clear directory boundaries so client doesn't accidentally import server code.",
            "YES! (nutrilens-monorepo: client + server + api)."
        ]
    ]
    b.table(arch_headers, arch_rows, [95, 125, 120, 115, 60])

    b.callout(
        "Root package.json Inspection: Notice how the root `package.json` contains a dev script:\n"
        "`concurrently \"npm run dev:mobile --prefix client\" \"npm run dev --prefix server\"`\n"
        "The tool `concurrently` runs both the Vite client on port 5173 and the Express server on port 5000 simultaneously "
        "in one terminal window. This is the hallmark of a professional monorepo setup!",
        title="CODEBASE SPOTLIGHT",
        kind="note"
    )

    b.exercise_box("Chapter 2: Architecture & Communication", [
        "Open `server/app.js` and locate `app.use(cors())`. What is CORS, and why does the frontend need permission to talk to the backend?",
        "Trace the files involved when a user logs in. Which file on the client handles it, and which file on the server verifies the user?",
        "Explain why Google Gemini API keys are kept in `server/config/env.js` instead of `client/src/services/api.js`."
    ])
    b.page_break()

    # =========================================================
    # CHAPTER 3: PROGRAMMING LANGUAGES IN KHANALENS
    # =========================================================
    b.chapter_banner(
        "3",
        "Programming Languages in KhanaLens",
        "How HTML, CSS, JavaScript, and TypeScript work together to construct the app"
    )

    b.section("3.1 The Four Web Languages & Their Project Roles")
    b.p(
        "Every modern web application is powered by four primary languages. In KhanaLens, they each fulfill a specialized role:"
    )

    lang_headers = ["Language", "Role / Analogy", "Where It Is Used in KhanaLens", "File Extensions"]
    lang_rows = [
        [
            "HTML (HyperText Markup Language)",
            "The Skeleton & Bones: Gives the application its structure, semantic tags, buttons, links, and text containers.",
            "`client/index.html` (root HTML shell) and inside every React component as JSX markup (`<h1>`, `<button>`, `<video>`).",
            "`.html`, `.jsx`"
        ],
        [
            "CSS (Cascading Style Sheets)",
            "The Skin, Makeup & Clothing: Controls colors, rounded corners, spacing, layout, gradients, and animations.",
            "`client/src/styles/theme.css` (custom design system), `client/src/index.css`, Tailwind v4 classes, and scoped CSS strings.",
            "`.css`, inline strings"
        ],
        [
            "JavaScript (ECMAScript 2023+)",
            "The Muscles & Brain: Handles user clicks, camera capture, API data fetching, math calculations, and server logic.",
            "Everywhere! React state logic (`client/src/pages/Home.jsx`), Express routes (`server/routes/`), and Gemini AI parsing.",
            "`.js`, `.jsx`"
        ],
        [
            "TypeScript (Typed JavaScript)",
            "The Safety Armor: Adds strict types (numbers, strings, shapes) to JavaScript to prevent runtime bugs before code runs.",
            "Currently optional in KhanaLens. JavaScript with JSDoc typing is used; TypeScript types can be added to solidify API contracts.",
            "`.ts`, `.tsx`"
        ]
    ]
    b.table(lang_headers, lang_rows, [95, 120, 215, 85])

    b.section("3.2 What Is JSX? Marrying HTML with JavaScript")
    b.p(
        "If you inspect `client/src/components/BrandLogo.jsx`, you will notice something peculiar: it looks like HTML tags "
        "written directly inside a JavaScript function! This syntax is called <b>JSX (JavaScript XML)</b>."
    )
    b.p(
        "Browsers cannot read JSX directly. The Vite build tool automatically transforms JSX into standard JavaScript "
        "(`React.createElement`) behind the scenes. This allows you to embed dynamic JavaScript logic directly within your markup:"
    )

    brand_logo_code = """// client/src/components/BrandLogo.jsx
import React from 'react';

export default function BrandLogo({ size = 32, className = '' }) {
  // Pure SVG markup embedded directly in a JavaScript component
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer rounded brand badge */}
      <rect width="100" height="100" rx="28" fill="#1F4D33" />
      {/* Dynamic leaf icon path rendered with KhanaLens Mint */}
      <path
        d="M50 20C35 20 25 35 25 50C25 65 35 80 50 80C65 80 75 65 75 50C75 35 65 20 50 20Z"
        fill="#3FA47A"
      />
    </svg>
  );
}"""
    b.code_block(brand_logo_code, filename="client/src/components/BrandLogo.jsx", title="JSX Example: Embedded SVG Logo")

    b.p(
        "<b>Line-by-Line Breakdown:</b>\n"
        "• <b>Line 4:</b> `export default function BrandLogo({ size = 32, className = '' })` defines a reusable JavaScript function that accepts 'props' (properties) with sensible default values.\n"
        "• <b>Line 6-13:</b> The `<svg>` element uses curly braces `{size}` to inject dynamic JavaScript numbers into HTML attributes.\n"
        "• <b>Line 15:</b> Notice `rx=\"28\"` and `fill=\"#1F4D33\"` — this creates the rounded dark green squircle badge that defines KhanaLens's visual identity."
    )

    b.callout(
        "JSX Rule: In standard HTML you write `class=\"my-button\"`. In JSX you MUST write `className=\"my-button\"`. "
        "Why? Because in JavaScript, the word `class` is a reserved programming keyword (used to create ES6 classes). "
        "If React allowed `class` in JSX, the JavaScript parser would get confused!",
        title="CRITICAL JSX DIFFERENCE",
        kind="important"
    )

    b.exercise_box("Chapter 3: Languages & Syntax", [
        "Open `client/src/components/Avatar.jsx`. Identify where HTML tags, CSS classNames, and JavaScript variables interact.",
        "Why do React components need to return a single parent element or a Fragment (`<>...</>`)?",
        "If you wanted to change the default size of `BrandLogo` from 32 to 48, which line of code would you edit?"
    ])
    b.page_break()
