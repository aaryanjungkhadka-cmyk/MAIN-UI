# cover_and_audit.py - Cover page, codebase audit matrix, and table of contents
import os
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, Image as RLImage, PageBreak
from reportlab.lib.colors import HexColor
from .styles import (
    COLOR_PRIMARY, COLOR_DEEP, COLOR_MINT, COLOR_MINT_LIGHT,
    COLOR_CREAM, COLOR_BEIGE, COLOR_BORDER, COLOR_TEXT, COLOR_MUTED
)

def build_cover_and_audit(b):
    styles = b.styles

    # =========================================================
    # 1. PROFESSIONAL COVER PAGE
    # =========================================================
    b.spacer(20)

    # Top Brand Ribbon
    ribbon_data = [
        [
            Paragraph("<b>KHANALENS ARCHITECTURE &amp; KNOWLEDGE TRANSFER</b>", styles['TableCellBold']),
            Paragraph("<b>PRODUCTION EDITION • UNIVERSITY-LEVEL REFERENCE</b>", styles['TableCell'])
        ]
    ]
    ribbon_table = Table(ribbon_data, colWidths=[270, 245])
    ribbon_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_CREAM),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('LINEBOTTOM', (0,0), (-1,-1), 2, COLOR_PRIMARY),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    b.add(ribbon_table)
    b.spacer(25)

    # Logo + Title
    logo_path = 'client/src/assets/images/KhanaLens.png'
    if not os.path.exists(logo_path):
        logo_path = 'client/public/Khanalens-Logo-round.png'
    
    if os.path.exists(logo_path):
        try:
            img = RLImage(logo_path, width=85, height=85)
            b.add(img)
            b.spacer(15)
        except Exception:
            pass

    b.add(Paragraph("COMPLETE PROJECT KNOWLEDGE TRANSFER &amp; ARCHITECTURAL BLUEPRINT", styles['CoverTitle']))
    b.add(Paragraph("A Comprehensive Full-Stack Software Engineering Textbook &amp; Codebase Reference for KhanaLens", styles['CoverSubtitle']))
    
    # Ornamental Rule
    rule = Table([[""]], colWidths=[515], rowHeights=[3])
    rule.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_MINT),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    b.add(rule)
    b.spacer(18)

    # Cover Description Card
    desc_text = (
        "This volume serves as the permanent, authoritative knowledge transfer manual and technical textbook "
        "for the entire <b>KhanaLens</b> application monorepo. Every chapter is grounded directly in the physical "
        "files of this repository—from the React 19 camera viewfinder and WebRTC compression pipeline to the Node.js Express "
        "REST backend, Google Gemini 3.5 multimodal AI nutrition model, Doko 3D video mascot with 16:9 responsive whiteboard layout, "
        "and Cloud Firestore dual-mode architecture. Written from the perspective of a Senior Technical Architect, it guides "
        "the reader from fundamental computing models to advanced full-stack engineering, complete with step-by-step coding solutions."
    )
    b.callout(desc_text, title="AUTHORITATIVE PROJECT KNOWLEDGE TRANSFER & TEXTBOOK", kind="tip")
    b.spacer(15)

    # Cover Badges / Metadata Table
    meta_data = [
        [
            Paragraph("<b>Author &amp; Role:</b>", styles['TableCellBold']),
            Paragraph("Senior Technical Architect, Lead Engineer &amp; Full-Stack Mentor", styles['TableCell'])
        ],
        [
            Paragraph("<b>Primary Stack:</b>", styles['TableCellBold']),
            Paragraph("React 19, Vite, Tailwind CSS v4, Node.js, Express, Google Gemini AI, Firebase Auth, Firestore", styles['TableCell'])
        ],
        [
            Paragraph("<b>Architecture:</b>", styles['TableCellBold']),
            Paragraph("Mobile-First PWA + Express REST API Monorepo (Dual-Mode Cloud/In-Memory Store)", styles['TableCell'])
        ],
        [
            Paragraph("<b>Mascot &amp; Media:</b>", styles['TableCellBold']),
            Paragraph("Doko (डालो / डोको) 3D Nepali Cultural Mascot with 16:9 Video Canvas &amp; Whiteboard Layout", styles['TableCell'])
        ],
        [
            Paragraph("<b>Target Deliverable:</b>", styles['TableCellBold']),
            Paragraph("`COMPLETE_PROJECT_KNOWLEDGE_TRANSFER.pdf` (17 Chapters, Codebase Audit &amp; Solutions)", styles['TableCell'])
        ]
    ]
    meta_table = Table(meta_data, colWidths=[120, 395])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_CREAM),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    b.add(meta_table)

    b.spacer(30)
    b.add(Paragraph("<i>“First make it work, then make it right, then make it fast.” — Kent Beck</i>", styles['ChapterSubtitle']))
    b.page_break()

    # =========================================================
    # 2. EXECUTIVE CODEBASE AUDIT & SYSTEM STATUS MATRIX
    # =========================================================
    b.chapter_banner("AUDIT", "Executive Codebase Audit & System Inventory", "Real-world status of all files, technologies, and services in KhanaLens")
    
    b.p(
        "Before diving into software engineering concepts, we conducted an exhaustive static audit of every "
        "directory and file in your KhanaLens repository. This inventory establishes exactly what exists, "
        "what runs dynamically, what operates via mock fallbacks, and what remains theoretical for future expansion."
    )
    b.spacer(6)

    b.section("1. Complete Monorepo Directory Layout")
    b.p(
        "KhanaLens is structured as a modern full-stack JavaScript monorepo. The repository cleanly divides "
        "client-side user interface code from server-side business logic and cloud integrations:"
    )

    tree_ascii = """KHANALENS-MONOREPO/
├── client/                     # Frontend Application (React 19 + Vite)
│   ├── public/                 # Static assets, WebM videos, sponsor graphics, logos
│   │   ├── sponsors/           # Partner banners (Nepal Organics, Himalayan Whey, Jiri, MuscleBlaze)
│   │   └── doko-*.mp4 / .webm  # Doko mascot video animations & 16:9 sponsor board video
│   ├── src/                    # Source code
│   │   ├── assets/             # Bundled images, 32 sliced avatars, local videos, fonts
│   │   ├── components/         # Reusable UI widgets (AppHeader, BottomNav, DokoMascot, AvatarPicker)
│   │   ├── context/            # React Context providers (AuthContext, LanguageContext)
│   │   ├── data/               # Static dataset definitions (plans.js, streak.js)
│   │   ├── hooks/              # Custom React hooks (useAuth.js, useNutrition.js)
│   │   ├── layouts/            # Layout wrappers (MainLayout.jsx)
│   │   ├── pages/              # 18 Page views (Home, Scan, Login, Setting, MealPlanner, etc.)
│   │   ├── services/           # Network & SDK layer (api.js, firebaseAuth.js, imageCompression.js)
│   │   ├── styles/             # Global CSS and tokens (theme.css, index.css)
│   │   ├── App.jsx             # React Router v7 routes & ProtectedRoute guards
│   │   └── main.jsx            # React root mount point
│   ├── index.html              # HTML5 entry template with viewport configuration
│   ├── package.json            # Client dependencies & scripts
│   └── vite.config.js          # Vite build configuration with basic-ssl
│
├── server/                     # Backend REST API (Node.js + Express)
│   ├── config/                 # Environment variables parser (env.js)
│   ├── controllers/            # Request handlers (auth, nutrition, mealPlan, sponsor, profile)
│   ├── middleware/             # Express middlewares (authMiddleware.js, errorMiddleware.js)
│   ├── routes/                 # Express route definitions (auth, nutrition, upload, sponsor)
│   ├── services/               # Core business services (geminiService, firestoreService, sponsorService)
│   ├── app.js                  # Express application setup & CORS configuration
│   ├── server.js               # HTTP listener bootstrap
│   └── package.json            # Server dependencies & scripts
│
├── api/                        # Vercel Serverless Function Bridge
│   ├── index.js                # Default serverless handler exporting server/app.js
│   └── [...path].js            # Catch-all serverless routing bridge
│
├── docs/                       # Project documentation & design guidelines
├── package.json                # Root monorepo script runner (concurrently)
└── README.md                   # Project overview & quickstart guide"""
    
    b.diagram_box("KhanaLens Monorepo File System", tree_ascii)
    b.spacer(6)

    b.section("2. Feature Implementation Status Matrix")
    b.p(
        "A critical principle of senior software engineering is distinguishing between fully connected production services, "
        "local client-side simulations, and graceful fallbacks. Below is the verified status of KhanaLens features:"
    )

    audit_headers = ["Feature", "Primary Files", "Implementation Status", "Technical Implementation Details"]
    audit_rows = [
        [
            "User Authentication",
            "`Login.jsx`\n`firebaseAuth.js`\n`authMiddleware.js`",
            "Fully Dynamic",
            "Firebase Auth with Email/Password & Google Sign-In popup. Backend validates via Firebase Admin or Google RS256 public keys."
        ],
        [
            "Smart Food Scanner",
            "`Scan.jsx`\n`geminiService.js`\n`nutritionController.js`",
            "Fully Dynamic",
            "WebRTC getUserMedia camera stream, client-side canvas compression, multipart/form-data upload, Google Gemini 3.5 structured AI analysis."
        ],
        [
            "Nutrition Logging",
            "`FoodAnalysisResult.jsx`\n`nutritionController.js`\n`firestoreService.js`",
            "Dual-Mode (Cloud / Memory)",
            "Saves scanned meal to Cloud Firestore 'meals' collection. If Firestore credentials are not supplied, falls back to inMemoryNutritionStore."
        ],
        [
            "7-Day AI Meal Plan",
            "`MealPlanner.jsx`\n`mealPlanController.js`\n`geminiService.js`",
            "Fully Dynamic",
            "Generates 7-day personalized Nepali/International meal plans using Gemini based on past meals and health goals. Enforces 3-day cooldown."
        ],
        [
            "Doko Whiteboard Sponsors Carousel",
            "`Home.jsx`\n`doko-sponsor-board.mp4`\n`sponsorService.js`",
            "Fully Dynamic",
            "16:9 mascot video holding whiteboard. Overlay content strictly in 53% whiteboard area (left: 6.8%), compact product thumbnail box, 3-second autoplay interval."
        ],
        [
            "Cultural Avatar System",
            "`AvatarPicker.jsx`\n`slice_avatars.py`\n`FoodAvatar.jsx`",
            "Fully Dynamic",
            "32 sliced Nepali/Asian cultural avatars with dynamic grid selection, local persistence, and fallback initials."
        ],
        [
            "Doko Mascot Video",
            "`DokoMascot.jsx`\n`LandingPage.jsx`\n`/assets/videos/`",
            "Fully Dynamic",
            "HTML5 video with autoplay/loop/muted, WebM transparency fallback, interactive tap physics jump, random Nepali health tips, particle sparkles."
        ],
        [
            "Subscription / Payment",
            "`UpgradePage.jsx`\n`PaymentPage.jsx`\n`PaymentLogos.jsx`",
            "UI Dynamic / Mock Gateways",
            "Authentic vector SVG logos for eSewa, Khalti, Fonepay, ConnectIPS. Plans & UI are active, but checkout completes via client simulation."
        ],
        [
            "Push Notifications",
            "`NotificationPage.jsx`",
            "UI Dynamic / Local State",
            "Clean tabbed alert center (All, Meals, System). Runs on React local state; real Web Push FCM service workers are planned for future."
        ],
        [
            "Profile & Health Goals",
            "`Setting.jsx`\n`ProfileSetup.jsx`\n`profileController.js`",
            "Dual-Mode (Cloud / Memory)",
            "Metric/Imperial units, target weight, dietary conditions, and macro goals saved to Firestore 'profiles' with fallback Map storage."
        ]
    ]
    b.table(audit_headers, audit_rows, [95, 110, 85, 225])

    b.callout(
        "Dual-Mode Resilience: Notice how the backend controllers (profileController, nutritionController, progressController) "
        "wrap Firestore calls in try-catch blocks and automatically fall back to `inMemoryNutritionStore.js`. "
        "This means the app continues to function smoothly on a local laptop even before setting up Firebase cloud service account keys!",
        title="ARCHITECTURAL RESILIENCE PATTERN",
        kind="tip"
    )
    b.page_break()

    # =========================================================
    # 3. TABLE OF CONTENTS
    # =========================================================
    b.chapter_banner("TOC", "Table of Contents & Curriculum Map", "Comprehensive 17-chapter handbook outline with exact page numbers")
    
    toc_headers = ["Chapter", "Page", "Topic & Focus Area", "Key Concepts & Real Code Covered"]
    toc_rows = [
        ["Audit", "p. 2", "Executive Codebase Audit & Status", "Full monorepo structure, technology inventory, and implementation status matrix."],
        ["Chapter 1", "p. 5", "Introduction to Software Development", "The 10 development stages, mental models, restaurant analogy, beginner pitfalls."],
        ["Chapter 2", "p. 7", "Understanding KhanaLens Architecture", "Client vs Server, REST APIs, JSON data flow, request lifecycle, monorepo design."],
        ["Chapter 3", "p. 9", "Programming Languages in KhanaLens", "HTML, CSS, JavaScript, TypeScript, JSX, and where each language lives."],
        ["Chapter 4", "p. 11", "Frontend Development & Models", "Web vs Native vs PWA, mobile-first design, viewport units (clamp, dvh), safe areas."],
        ["Chapter 5", "p. 13", "HTML & CSS Mastery", "Box model, Flexbox, Grid, positioning, z-index, animations, theme.css walkthrough."],
        ["Chapter 6", "p. 15", "Modern JavaScript Foundations", "Variables, arrow functions, async/await, promises, array methods (map, filter, reduce)."],
        ["Chapter 7", "p. 17", "React – The Engine of KhanaLens", "Components, props, state, hooks (useState, useEffect, useRef, useAuth), routing."],
        ["Chapter 8", "p. 19", "KhanaLens Complete 16-Feature Breakdown", "Deep dive into all core features: Scanner, Doko, Whiteboard Carousel, Avatars, Nav."],
        ["Chapter 9", "p. 27", "Animation & Media Development", "Keyframes, WebM vs MP4, autoplay policies, canvas image compression, Doko physics."],
        ["Chapter 10", "p. 29", "Frontend Architecture", "Component-based architecture, folder organization, separation of concerns, refactoring."],
        ["Chapter 11", "p. 30", "Backend & Database Fundamentals", "Node.js, Express, REST endpoints, JWT/Firebase auth, Firestore collections vs in-memory."],
        ["Chapter 12", "p. 32", "Git, GitHub & Package Management", "Version control, commits, branches, npm, package.json, scripts, Vite build pipeline."],
        ["Chapter 13", "p. 33", "Debugging & Problem Solving", "Root cause methodology, solving layout overlap, camera blackouts, bottom nav jitter."],
        ["Chapter 14", "p. 34", "Deployment & Production", "Vercel edge hosting, serverless functions, environment secrets, security, performance."],
        ["Chapter 15", "p. 35", "Practical Learning Roadmap", "Step-by-step developer progression, 10 hands-on KhanaLens mini-projects, graduation."],
        ["Chapter 16", "p. 37", "Practical Exercises with Step-by-Step Solutions", "Six production-grade coding exercises with complete, working solutions & breakdowns."],
        ["Chapter 17", "p. 47", "Known Issues, Incomplete Features & Roadmap", "Transparent audit of edge cases, simulated systems, and strategic multi-phase roadmap."],
        ["Glossary", "p. 49", "Comprehensive Technical Dictionary", "Over 50 plain-English definitions of essential software engineering terminology."]
    ]
    b.table(toc_headers, toc_rows, [55, 35, 175, 250])

    b.callout(
        "How to use this handbook: Read each chapter actively. Whenever a code snippet is shown, locate that "
        "exact file inside your project (`client/src/...` or `server/...`). Try modifying values slightly in your local "
        "codebase to observe how the interface responds, then complete the chapter exercises.",
        title="STUDY RECOMMENDATION",
        kind="note"
    )
    b.page_break()
