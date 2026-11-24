# chapters_12_to_15.py - Chapters 12, 13, 14, and 15
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, PageBreak
from .styles import escape_xml

def build_chapters_12_to_15(b):
    styles = b.styles

    # =========================================================
    # CHAPTER 12: GIT, GITHUB & PACKAGE MANAGEMENT
    # =========================================================
    b.chapter_banner(
        "12",
        "Git, GitHub, and Package Management",
        "Version control workflows, branching strategies, npm dependencies, and the Vite production build pipeline"
    )

    b.section("12.1 Version Control: Git vs GitHub")
    b.p(
        "Beginners often confuse Git with GitHub. They are related, but completely different tools:"
    )
    b.bullet("<b>Git:</b> A local, command-line software tool that runs on your computer. It acts as a time machine for your codebase, taking permanent snapshots ('commits') of your files so you can experiment freely without fear of losing working code.")
    b.bullet("<b>GitHub:</b> A cloud-based website and collaboration service that hosts your remote Git repositories. It allows you to back up your code safely in the cloud, collaborate with teammates, and trigger automated deployment pipelines.")

    b.section("12.2 Essential Everyday Git Commands")
    git_headers = ["Command", "What It Does", "Real Everyday Scenario"]
    git_rows = [
        ["`git status`", "Displays which files have been modified, created, or deleted.", "Always run this first before making a commit to see what changed."],
        ["`git add .`", "Stages all current changes into the preparation area.", "Gathers your edits to `Home.jsx` and `theme.css` together."],
        ["`git commit -m \"feat: ...\"`", "Creates a permanent historical snapshot with an explanatory message.", "`git commit -m \"feat: add Doko jumping physics\"`"],
        ["`git branch feature-scanner`", "Creates an isolated branch to experiment without breaking the main branch.", "Building the camera viewfinder without affecting the live landing page."],
        ["`git checkout main`", "Switches your local workspace to a different branch.", "Returning to the stable production codebase."],
        ["`git merge feature-scanner`", "Integrates verified experimental changes back into the main branch.", "Merging the completed scanner into production."],
        ["`git push origin main`", "Uploads your local commits to the remote GitHub cloud repository.", "Backing up your code and triggering automated Vercel deployment."]
    ]
    b.table(git_headers, git_rows, [110, 185, 220])

    b.section("12.3 Demystifying npm, package.json, and node_modules")
    b.p(
        "When building modern software, we don't invent every wheel from scratch. We use pre-built open-source packages "
        "via <b>npm (Node Package Manager)</b>:"
    )
    b.bullet("<b>package.json:</b> The manifest or recipe book of your project. It lists project metadata, custom terminal scripts (`npm run dev`), and all external dependencies your app relies upon (e.g. `lucide-react`, `axios`).")
    b.bullet("<b>package-lock.json:</b> The exact mathematical lock-tree. It guarantees that if a teammate or cloud server installs your project in Tokyo next year, they download the exact same sub-dependency versions you tested with.")
    b.bullet("<b>node_modules/:</b> The physical folder where npm downloads thousands of third-party libraries. NEVER edit files inside `node_modules`! Furthermore, NEVER commit `node_modules` to Git (it is always listed in `.gitignore`).")

    b.callout(
        "Vite Build Pipeline: When you run `npm run build` inside `client/`, the Vite bundler reads all your JSX and CSS, "
        "strips away unused code ('tree-shaking'), minifies variable names to single letters, compresses assets, "
        "and produces a lightning-fast static folder `client/dist/` ready for global CDN deployment!",
        title="PRODUCTION COMPILATION",
        kind="tip"
    )

    b.exercise_box("Chapter 12: Git & Package Management", [
        "Why should `node_modules/` always be included inside your `.gitignore` file?",
        "What is the difference between `dependencies` and `devDependencies` in `client/package.json`?",
        "If you make a code mistake that breaks the app, how does Git allow you to revert to your last working commit?"
    ])
    b.page_break()

    # =========================================================
    # CHAPTER 13: DEBUGGING AND PROBLEM SOLVING
    # =========================================================
    b.chapter_banner(
        "13",
        "Debugging and Problem Solving: Real Case Studies",
        "Root cause engineering methodology vs applying superficial CSS band-aids"
    )

    b.section("13.1 The Senior Engineer's Debugging Methodology")
    b.p(
        "Amateur developers fix bugs by frantically pasting random CSS snippets from ChatGPT until the visual symptom disappears. "
        "This creates 'CSS band-aids' that cause three new bugs on different screen sizes. "
        "Senior engineers follow a disciplined 6-step root cause methodology:"
    )
    b.bullet("<b>1. Accurately Reproduce:</b> Identify the exact steps, device, browser, and viewport size where the failure occurs.")
    b.bullet("<b>2. Isolate the Layer:</b> Is it a CSS rendering bug, a React state timing issue, or a backend API failure?")
    b.bullet("<b>3. Inspect DevTools:</b> Open Chrome DevTools (F12). Check the Console for red JavaScript errors and inspect Computed CSS box styles.")
    b.bullet("<b>4. Formulate Hypothesis:</b> 'The bottom navigation is shifting because the mobile virtual keyboard changes viewport height.'")
    b.bullet("<b>5. Apply Targeted Root Cause Fix:</b> Fix the architectural flaw at the source, rather than adding a hacky `margin-top: -20px`.")
    b.bullet("<b>6. Cross-Device Verification:</b> Test the fix on desktop, mobile Chrome, and iOS Safari.")

    b.section("13.2 Real KhanaLens Debugging Case Studies")
    b.p(
        "During the development of KhanaLens, several complex real-world bugs were identified and engineered. "
        "Studying these actual problems will accelerate your programming maturity:"
    )

    debug_headers = ["Problem & Symptom", "Initial Amateur 'Fix'", "Actual Root Cause", "The Professional Solution"]
    debug_rows = [
        [
            "1. Overlapping Mascot & Banner",
            "Added arbitrary `z-index: 99` and negative margins.",
            "A parent container had `overflow: hidden` and lacked an explicit CSS Stacking Context.",
            "Created clear stacking context with `position: relative`, isolated z-indexes, and used flexbox gap spacing."
        ],
        [
            "2. Jittery Bottom Navigation",
            "Forced `position: absolute; bottom: 0;` inside the page content.",
            "When scrolling long content, the nav bar scrolled off-screen or jittered on mobile address bar collapse.",
            "Moved `BottomNav` to `createPortal(..., document.body)` with `position: fixed; bottom: 20px; z-index: 9999;`."
        ],
        [
            "3. Mobile Camera Blackout",
            "Assumed user's phone camera was physically broken.",
            "1. Browser was loaded over HTTP (WebRTC requires HTTPS/secureContext).\n2. `facingMode: { exact: 'environment' }` failed on phones with multi-lens cameras.",
            "Checked `window.isSecureContext`. Switched to `facingMode: { ideal: requestedFacingMode }` with OverconstrainedError fallback."
        ],
        [
            "4. Video Autoplay Failure",
            "Added duplicate `autoplay` tags in JSX.",
            "Mobile browsers forbid unmuted autoplay to protect user data and battery.",
            "Added `muted={true}`, `playsInline={true}`, and supplied a static image `poster` fallback."
        ],
        [
            "5. Upload HTTP 413 Error",
            "Attempted to increase server RAM buffer to 50MB.",
            "High-resolution smartphone photos exceeded Vercel's 4.5MB serverless payload limit.",
            "Implemented client-side canvas downsampling in `imageCompression.js` before network transmission."
        ],
        [
            "6. AI Quota Exhaustion",
            "Blamed Google Gemini servers for failing.",
            "Users were repeatedly tapping 'Generate Meal Plan', making expensive parallel multi-shot API calls.",
            "Engineered a server-side 3-day (72-hour) cooldown timer in `mealPlanController.js` returning HTTP 429."
        ]
    ]
    b.table(debug_headers, debug_rows, [95, 105, 140, 175])

    b.exercise_box("Chapter 13: Debugging Mastery", [
        "Why is applying negative margins (`margin-top: -15px`) usually a sign of an amateur CSS band-aid?",
        "If your camera scanner displays 'Camera permission blocked', which browser security policy must you check first?",
        "Open Chrome DevTools on your computer (Press F12). What tab do you check to inspect HTTP network requests?"
    ])
    b.page_break()

    # =========================================================
    # CHAPTER 14: DEPLOYMENT AND PRODUCTION OPERATIONS
    # =========================================================
    b.chapter_banner(
        "14",
        "Deployment and Production Operations",
        "From local development to global edge hosting, environment secrets, and web security"
    )

    b.section("14.1 Development vs Production Environments")
    b.p(
        "Code behaves differently during local development compared to public cloud production:"
    )
    b.bullet("<b>Local Development (`npm run dev`):</b> Optimizes for developer velocity. Vite provides Hot Module Replacement (HMR) to reflect code edits in 50ms without reloading. Verbose debug warnings are shown in the console.")
    b.bullet("<b>Production (`npm run build`):</b> Optimizes for end-user speed and security. Code is minified, dead code is removed, assets are cached globally across Cloudflare or Vercel Edge CDNs, and debugging logs are stripped.")

    b.section("14.2 Hosting KhanaLens: Vercel Monorepo Deployment")
    b.p(
        "KhanaLens is configured to deploy seamlessly to <b>Vercel</b>. Look at `vercel.json` in your repository root:"
    )

    vercel_code = """// vercel.json
{
  "version": 2,
  "builds": [
    { "src": "client/package.json", "use": "@vercel/static-build", "config": { "distDir": "dist" } },
    { "src": "api/[...path].js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/[...path].js" },
    { "src": "/(.*)", "dest": "/client/$1" }
  ]
}"""
    b.code_block(vercel_code, filename="vercel.json", title="Vercel Edge & Serverless Monorepo Configuration")

    b.p(
        "<b>How it works:</b> Vercel routes any request starting with `/api/` to your Node.js Express serverless function "
        "in `api/[...path].js`. All other requests are routed directly to your compiled React client. "
        "This gives you a full-stack application under a single unified web domain!"
    )

    b.section("14.3 Environment Secrets & Security Rules")
    b.callout(
        "The #1 Golden Rule of Cloud Security: NEVER commit `.env` files, Firebase service account JSON files, "
        "or Google Gemini API keys into Git! Anyone with read access to your GitHub repository can scrape your keys. "
        "Always add `.env` to `.gitignore`, and configure production secrets directly in the Vercel Dashboard under "
        "Project Settings -> Environment Variables.",
        title="SECURITY MANDATE",
        kind="warning"
    )

    b.exercise_box("Chapter 14: Deployment", [
        "In `vercel.json`, how does Vercel distinguish between a frontend page request and a backend API request?",
        "Where should production API keys (like `GEMINI_API_KEY`) be stored when deploying to Vercel?",
        "What is the role of a Content Delivery Network (CDN) in serving your compiled React app?"
    ])
    b.page_break()

    # =========================================================
    # CHAPTER 15: PRACTICAL LEARNING ROADMAP
    # =========================================================
    b.chapter_banner(
        "15",
        "Practical Learning Roadmap & Next Steps",
        "The 6-stage developer curriculum, 10 hands-on KhanaLens mini-projects, and graduation"
    )

    b.section("15.1 The 6-Stage Curriculum: From Beginner to Independent Full-Stack Engineer")
    b.p(
        "Mastering software engineering is a marathon, not a sprint. Follow this progressive 6-stage roadmap:"
    )

    roadmap_headers = ["Phase", "Curriculum & Skills to Master", "Time Estimate", "Milestone Project"]
    roadmap_rows = [
        [
            "Phase 1: HTML & CSS Mastery",
            "Semantic HTML, CSS Box Model, Flexbox alignment, CSS Grid, mobile responsive frames, media queries.",
            "2 - 3 Weeks",
            "Build a static clone of KhanaLens's Today Summary Card and Navigation Bar from scratch without React."
        ],
        [
            "Phase 2: Modern JavaScript",
            "Variables (`const`/`let`), arrow functions, array methods (`map`, `filter`, `reduce`), Promises, async/await.",
            "3 - 4 Weeks",
            "Build an interactive calorie calculator that takes user food inputs and calculates daily macro sums."
        ],
        [
            "Phase 3: React Fundamentals",
            "Components, props, `useState`, `useEffect`, `useRef`, custom hooks, lists & keys, React Router routing.",
            "4 - 5 Weeks",
            "Rebuild `DokoMascot.jsx` and add custom speech bubble controls and animation toggles."
        ],
        [
            "Phase 4: Backend REST APIs",
            "Node.js runtime, Express routing, HTTP status codes, middleware, file uploads with Multer, JWT tokens.",
            "3 - 4 Weeks",
            "Build an Express API endpoint that accepts multipart image uploads and returns mock nutrition JSON."
        ],
        [
            "Phase 5: Cloud Databases",
            "Cloud Firestore collections/documents, NoSQL data modeling, Firestore security rules, Firebase Auth.",
            "3 Weeks",
            "Connect user meal history and streak calculations to live Firestore documents."
        ],
        [
            "Phase 6: AI & Production",
            "Google Gemini API integration, prompt engineering, structured JSON schemas, Vercel CI/CD edge deployment.",
            "3 - 4 Weeks",
            "Deploy KhanaLens with custom domain, monitoring error logs, and automated GitHub releases."
        ]
    ]
    b.table(roadmap_headers, roadmap_rows, [85, 175, 75, 180])

    b.section("15.2 Ten Hands-On KhanaLens Coding Challenges")
    b.p(
        "The fastest way to learn is by doing. Attempt these 10 real engineering tasks in your KhanaLens repository:"
    )
    b.bullet("<b>Challenge 1 (CSS):</b> In `theme.css`, add a `--kl-dark-mode` toggle that switches the cream background to deep charcoal.")
    b.bullet("<b>Challenge 2 (React State):</b> In `FoodAnalysisResult.jsx`, add an editable slider allowing users to adjust portion size from 0.5x to 2.0x, automatically multiplying calorie counts in real-time.")
    b.bullet("<b>Challenge 3 (UI Widget):</b> In `Home.jsx`, create a 'Water Hydration Tracker' card with buttons (+250ml) to log daily water intake up to 3,000ml.")
    b.bullet("<b>Challenge 4 (Array Methods):</b> In `History.jsx`, add filter buttons ('All', 'Breakfast', 'Lunch', 'Dinner') using `Array.prototype.filter()`.")
    b.bullet("<b>Challenge 5 (Animation):</b> In `DokoMascot.jsx`, add 3 new Nepali phrases and an SVG confetti burst when the user reaches a 7-day streak.")
    b.bullet("<b>Challenge 6 (Backend API):</b> In `server/controllers/nutritionController.js`, add an endpoint `DELETE /api/nutrition/meals/:id` to remove tracked meals from Firestore.")
    b.bullet("<b>Challenge 7 (React Hooks):</b> Build a custom hook `useOnlineStatus.js` that listens to `navigator.onLine` and shows a clean banner when internet connection drops.")
    b.bullet("<b>Challenge 8 (Payment Integration):</b> Connect `PaymentPage.jsx` to a real sandbox test transaction using the eSewa or Khalti test merchant credentials.")
    b.bullet("<b>Challenge 9 (Performance):</b> Run Google Lighthouse in Chrome DevTools on your live site and optimize images to achieve a 95+ performance score.")
    b.bullet("<b>Challenge 10 (Refactoring):</b> Decompose `client/src/pages/Home.jsx` into 4 cleanly separated sub-component files.")

    b.callout(
        "A Personal Note from Your Senior Technical Architect: When you first began developing KhanaLens, "
        "you relied entirely on AI prompts. As you study this handbook, you will realize that software engineering "
        "is not magic. It is simply logical systems composed of functions, state, styling, and network packets. "
        "Never hesitate to open files, change a line of code, break things, and read the error logs. "
        "That is how every great senior engineer was forged. Welcome to the craft of software development!",
        title="GRADUATION MESSAGE",
        kind="tip"
    )

    b.page_break()
