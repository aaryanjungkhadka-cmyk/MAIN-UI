# chapters_4_to_7.py - Chapters 4, 5, 6, and 7
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, PageBreak
from .styles import escape_xml

def build_chapters_4_to_7(b):
    styles = b.styles

    # =========================================================
    # CHAPTER 4: FRONTEND DEVELOPMENT & APPLICATION MODELS
    # =========================================================
    b.chapter_banner(
        "4",
        "Frontend Development & Application Models",
        "Understanding web apps, native apps, PWAs, and KhanaLens's mobile-first architecture"
    )

    b.section("4.1 What Is Frontend Development?")
    b.p(
        "<b>Frontend development</b> is the art and engineering of creating everything a user experiences directly: "
        "the layout, visual hierarchy, micro-interactions, responsive typography, tactile touch feedback, and device hardware integration "
        "(such as accessing the phone's camera). The frontend transforms cold server data into an engaging human experience."
    )

    b.section("4.2 Comparing Application Architecture Models")
    b.p(
        "When building software in 2026, developers can choose between several deployment paradigms. "
        "Here is how they compare in capabilities, development cost, and distribution:"
    )

    app_headers = ["Application Model", "Technologies Used", "Pros", "Cons & Challenges", "KhanaLens Approach"]
    app_rows = [
        [
            "Traditional Web App (MPA)",
            "HTML, CSS, PHP / Django / Rails. Every click reloads a new page.",
            "Great SEO; easy for content blogs and e-commerce catalogs.",
            "Sluggish page transitions; feels like a website, not a slick mobile app. No offline camera support.",
            "Not used."
        ],
        [
            "Single Page App (SPA)",
            "React, Vue, Vite, React Router. A single HTML page dynamically swaps views.",
            "Lightning-fast client routing without page reloads; smooth native app feel; rich state.",
            "Initial JavaScript bundle download takes a fraction of a second longer.",
            "YES! (React 19 + React Router v7)."
        ],
        [
            "Native Mobile App",
            "Swift (iOS) and Kotlin (Android). Two completely separate codebases.",
            "100% native hardware performance; published to Apple App Store & Google Play Store.",
            "Double the development cost; Apple takes 30% cut; long app review approval delays.",
            "Not currently needed."
        ],
        [
            "Cross-Platform Hybrid",
            "React Native, Flutter. Compiles a single codebase to native mobile binaries.",
            "Single codebase publishes to App Store and Play Store; good performance.",
            "Requires mobile developer licenses, Xcode, Android Studio, and complex native build pipelines.",
            "A natural future upgrade path if native app store presence is required."
        ],
        [
            "Progressive Web App (PWA)",
            "Web Standards + Web App Manifest + Service Workers + WebRTC Camera.",
            "Zero app store friction! Users can 'Add to Home Screen', runs full-screen, accesses camera directly.",
            "Apple iOS restricts some background push notifications and bluetooth APIs.",
            "YES! KhanaLens uses a PWA-ready mobile-first responsive architecture."
        ]
    ]
    b.table(app_headers, app_rows, [85, 95, 115, 120, 100])

    b.section("4.3 How KhanaLens Achieves a Native Mobile Experience on the Web")
    b.p(
        "KhanaLens is designed mobile-first. If you open KhanaLens on a wide desktop monitor, it doesn't stretch awkwardly "
        "across the entire screen like a giant spreadsheet. Instead, it centers a sleek, phone-sized frame (`.kl-app-frame`) "
        "with rounded corners and deep cream borders, mimicking an iPhone or Pixel display:"
    )

    frame_css = """/* client/src/styles/theme.css */
.kl-app-frame {
  position: relative;
  width: 100%;
  max-width: 420px;          /* Restricts width on desktop to phone size */
  min-height: 100dvh;        /* Dynamic Viewport Height (adapts to mobile address bar) */
  margin: 0 auto;            /* Horizontally centers the frame on desktop */
  display: flex;
  flex-direction: column;
  background: linear-gradient(170deg, #FBF8F0 0%, #F7F1E4 60%, #F2EADA 100%);
  overflow-x: hidden;
  box-sizing: border-box;
}

@media (min-width: 481px) {
  .kl-app-frame {
    min-height: calc(100dvh - 32px);
    margin: 16px auto;
    border-radius: 40px;     /* Smooth smartphone curvature on desktop screens */
    box-shadow: 0 25px 70px rgba(31, 77, 51, 0.18);
  }
}"""
    b.code_block(frame_css, filename="client/src/styles/theme.css", title="Mobile-First App Frame Architecture")

    b.callout(
        "What is `dvh`? On mobile browsers (Safari on iOS, Chrome on Android), the bottom navigation bar and top address bar "
        "slide in and out as you scroll. Traditional `100vh` ignores these bars, causing the bottom navigation to be cut off! "
        "`100dvh` (Dynamic Viewport Height) automatically resizes as the mobile browser bars expand and contract. "
        "KhanaLens uses `dvh` across `theme.css` and `LandingPage.jsx` to ensure buttons are never hidden!",
        title="MODERN CSS VIEWPORT UNIT: dvh",
        kind="tip"
    )

    b.exercise_box("Chapter 4: Frontend Models", [
        "What are the benefits of building KhanaLens as a mobile-first PWA rather than publishing to the Apple App Store first?",
        "Inspect `.kl-app-frame` in `client/src/styles/theme.css`. What happens when a user views the app on a screen narrower than 480px?",
        "Why is `100dvh` superior to `100vh` on modern smartphones?"
    ])
    b.page_break()

    # =========================================================
    # CHAPTER 5: HTML AND CSS MASTERY – KHANALENS EDITION
    # =========================================================
    b.chapter_banner(
        "5",
        "HTML and CSS Mastery – KhanaLens Edition",
        "The box model, flexbox, grid, positioning, z-index, animations, and the theme.css design system"
    )

    b.section("5.1 The CSS Box Model: Margin, Border, Padding, Content")
    b.p(
        "Every single HTML element rendered on the screen is a rectangular box. Understanding the <b>Box Model</b> "
        "is the foundation of all CSS mastery:"
    )

    box_ascii = """+-------------------------------------------------------+
|  MARGIN (Transparent space outside the element box)    |
|  +-------------------------------------------------+  |
|  |  BORDER (Visible boundary stroke: 1px solid)   |  |
|  |  +-------------------------------------------+  |  |
|  |  |  PADDING (Inner breathing room)          |  |  |
|  |  |  +-------------------------------------+  |  |  |
|  |  |  |  CONTENT (Text, Image, Video, SVG)  |  |  |  |
|  |  |  +-------------------------------------+  |  |  |
|  |  +-------------------------------------------+  |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+"""
    b.diagram_box("The CSS Box Model", box_ascii)

    b.p(
        "<b>The Box-Sizing Revolution:</b> In legacy CSS, adding padding increased the total width of an element, breaking layouts. "
        "In KhanaLens, we use `box-sizing: border-box;` globally:\n"
        "`* { box-sizing: border-box; }`\n"
        "With `border-box`, if you set an element to `width: 100px` and add `padding: 20px`, the browser keeps the element at 100px "
        "and shrinks the content area. This eliminates broken layouts!"
    )

    b.section("5.2 Flexbox vs CSS Grid in KhanaLens")
    b.p(
        "Layout in modern CSS is governed by two superpowers: <b>Flexbox</b> (1-dimensional) and <b>CSS Grid</b> (2-dimensional)."
    )

    layout_headers = ["Layout System", "Direction", "Best For", "Where It Is Used in KhanaLens"]
    layout_rows = [
        [
            "Flexbox (`display: flex`)",
            "1-Dimensional (Row OR Column)",
            "Distributing items along a single axis; centering buttons; horizontal navbar tabs; vertical card stacks.",
            "`BottomNav.jsx` (horizontal row of 5 navigation tabs), `AppHeader.jsx` (avatar on left, greeting in center, bell on right)."
        ],
        [
            "CSS Grid (`display: grid`)",
            "2-Dimensional (Rows AND Columns simultaneously)",
            "Multi-column dashboards, photo galleries, avatar pickers, and nutrition breakdown cards.",
            "`AvatarPicker.jsx` (grid of avatars in columns), `Goals.jsx` (2-column macro target grid), `Home.jsx` sponsor cards."
        ]
    ]
    b.table(layout_headers, layout_rows, [95, 110, 150, 160])

    b.section("5.3 CSS Positioning: Static, Relative, Absolute, Fixed, Sticky")
    b.p(
        "Positioning determines where an element appears on the screen, and whether other elements flow around it:"
    )
    b.bullet("<b>static:</b> The default. Elements flow naturally down the page in the order they appear in the HTML.")
    b.bullet("<b>relative:</b> The element stays in the normal flow, but can be shifted with `top/left`. Crucially, it acts as an anchor for any child elements using `position: absolute`.")
    b.bullet("<b>absolute:</b> The element is lifted completely out of the page flow! It positions itself relative to the nearest parent with `position: relative` (e.g. the 'Sponsored' badge floating on the corner of a food card).")
    b.bullet("<b>fixed:</b> The element is anchored to the user's glass screen/viewport! Even when the user scrolls 1,000 pixels down, a fixed element stays pinned (e.g. `BottomNav.jsx`).")
    b.bullet("<b>sticky:</b> A hybrid. The element behaves like normal static flow until the user scrolls past it, at which point it sticks to the top of the screen (e.g. date headers in `History.jsx`).")

    b.section("5.4 Z-Index and Stacking Contexts")
    b.p(
        "Have you ever had an image or button accidentally hide behind another element? That is a <b>z-index</b> collision. "
        "Think of the computer screen as having a Z-axis extending toward your face. Elements with higher `z-index` numbers "
        "appear in front of elements with lower numbers."
    )
    b.p(
        "In `BottomNav.jsx`, notice: `z-index: 9999;`. This ensures that even when the user scrolls through dense sponsor banners "
        "and meal cards, the floating navigation bar always remains above the content."
    )

    b.section("5.5 Modern Visual Styling in theme.css: Glassmorphism, Gradients & Shadows")
    b.p(
        "Let us examine the exact tokens from `client/src/styles/theme.css` that give KhanaLens its organic, premium health feel:"
    )

    theme_code = """/* client/src/styles/theme.css */
:root {
  --kl-green: #1F4D33;         /* Deep Himalayan Forest Green */
  --kl-green-deep: #163D29;    /* Darkest green for active button states */
  --kl-mint: #3FA47A;          /* Active Mint Green Accent */
  --kl-mint-light: #8FD7B4;    /* Light mint for progress fills */
  --kl-cream: #FBF7EE;         /* Warm background cream */
  --kl-beige: #F7F1E4;         /* Soft card surface */
  --kl-beige-deep: #E9DCC3;    /* Card border accents */
  --kl-text: #1F4D33;          /* Main readable typography */
  --kl-muted: rgba(31, 77, 51, 0.65); /* 65% opacity secondary text */
  --kl-shadow: 0 30px 60px rgba(31, 77, 51, 0.12); /* Soft organic shadow */
  --kl-radius-card: 34px;      /* Generous 34px card curvature */
  --kl-radius-btn: 18px;       /* Touch-friendly 18px button curvature */
}

/* Glassmorphism card utility */
.glass-card {
  background: rgba(251, 248, 240, 0.85); /* Semi-transparent cream */
  backdrop-filter: blur(16px);             /* Blurs underlying background */
  -webkit-backdrop-filter: blur(16px);     /* Safari iOS support */
  border: 1px solid rgba(233, 220, 195, 0.6);
  border-radius: var(--kl-radius-card);
  box-shadow: var(--kl-shadow);
}"""
    b.code_block(theme_code, filename="client/src/styles/theme.css", title="KhanaLens Design Tokens & Glassmorphism")

    b.callout(
        "Why Avoid Heavy Black Shadows: Notice `--kl-shadow: 0 30px 60px rgba(31, 77, 51, 0.12);`. "
        "Beginners often use `rgba(0,0,0,0.5)` for shadows, which looks harsh, muddy, and artificial. "
        "By tinting the shadow with our brand forest green (`31, 77, 51`), the shadows look soft, organic, and harmonious!",
        title="SENIOR DESIGN SECRET",
        kind="tip"
    )

    b.exercise_box("Chapter 5: HTML & CSS Mastery", [
        "In `client/src/styles/theme.css`, change `--kl-radius-card` from 34px to 10px and refresh your browser. What happens to the personality of the app?",
        "Explain the difference between `position: fixed` and `position: absolute`. Which one does `BottomNav.jsx` use?",
        "Why is `backdrop-filter: blur(16px)` paired with a semi-transparent background color like `rgba(..., 0.85)`?"
    ])
    b.page_break()

    # =========================================================
    # CHAPTER 6: MODERN JAVASCRIPT FOUNDATIONS
    # =========================================================
    b.chapter_banner(
        "6",
        "Modern JavaScript Foundations",
        "Variables, arrow functions, async/await, promises, and the functional array methods powering KhanaLens"
    )

    b.section("6.1 Variables & Data Types: const, let, and Immutability")
    b.p(
        "JavaScript stores information in variables. In modern ES2023+ JavaScript, we never use the obsolete `var` keyword. "
        "Instead, we choose between `const` and `let`:"
    )
    b.bullet("<b>const:</b> Used for 95% of variables. Indicates that the variable reference will never be reassigned. (e.g. `const API = axios.create(...)`).")
    b.bullet("<b>let:</b> Used only when a variable's value must change over time, such as loop counters or accumulated totals (e.g. `let streak = 0`).")

    b.section("6.2 Essential Functional Array Methods in KhanaLens")
    b.p(
        "In React applications, we rarely write old-fashioned `for` loops. Instead, we use expressive, functional array methods. "
        "Let us examine how `reduce()`, `map()`, and `filter()` operate directly inside KhanaLens:"
    )

    b.subsection("1. Array.prototype.reduce() — Calculating Daily Nutrition Totals")
    b.p(
        "In `server/controllers/nutritionController.js`, when a user requests their nutrition history, the server receives "
        "a list of meal objects and must calculate the sum of all calories, proteins, carbs, and fats:"
    )

    reduce_code = """// server/controllers/nutritionController.js (Lines 52-60)
const totals = logs.reduce((sum, meal) => {
  sum.calories += meal.totals?.calories || meal.calories || 0;
  sum.protein  += meal.totals?.protein  || meal.protein  || 0;
  sum.carbs    += meal.totals?.carbohydrates || meal.carbs || 0;
  sum.fat      += meal.totals?.fat      || meal.fat      || 0;
  return sum;
}, { calories: 0, protein: 0, carbs: 0, fat: 0 }); // Initial accumulator accumulator object"""
    b.code_block(reduce_code, filename="server/controllers/nutritionController.js", title="Calculating Macro Totals with reduce()")

    b.p(
        "<b>How reduce works:</b> It takes an initial object `{ calories: 0, protein: 0, ... }` (called the 'accumulator') "
        "and loops over every meal in `logs`. On each iteration, it adds the current meal's macros to `sum` and returns it. "
        "At the end, a single summarized object is returned!"
    )

    b.subsection("2. Array.prototype.map() — Transforming Data into UI Elements")
    b.p(
        "In `client/src/components/BottomNav.jsx`, we don't write 5 separate button components manually. "
        "Instead, we define an array of tab data and use `map()` to transform each tab into a clickable link:"
    )

    map_code = """// client/src/components/BottomNav.jsx
{TABS.map((tab) => {
  const Icon = tab.icon;
  const isActive = currentTab === tab.id;
  return (
    <Link key={tab.id} to={tab.to} className={`nav-tab ${isActive ? 'active' : ''}`}>
      <Icon size={20} />
      <span>{tab.label}</span>
    </Link>
  );
})}"""
    b.code_block(map_code, filename="client/src/components/BottomNav.jsx", title="Rendering Navigation Tabs with map()")

    b.section("6.3 Asynchronous JavaScript: Promises & Async / Await")
    b.p(
        "JavaScript is single-threaded: it can only do one task at a time. If you request an AI food analysis from Google Gemini, "
        "the AI model might take 2.5 seconds to inspect the image. If JavaScript waited synchronously, the user's phone screen "
        "would completely freeze!"
    )
    b.p(
        "To prevent freezing, JavaScript uses <b>Promises</b> and <b>async / await</b>. When you use `await`, JavaScript pauses "
        "only that specific function, allowing the browser to keep animating Doko mascot smoothly while the network request travels across the internet:"
    )

    async_code = """// client/src/hooks/useNutrition.js
export const useNutrition = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scanFood = useCallback(async (imageFile) => {
    setLoading(true);     // 1. Tell UI to show spinner
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('language', 'en');

      // 2. Await pauses here until server responds, but screen doesn't freeze!
      const res = await scanFoodApi(formData);
      
      setLoading(false);   // 3. Stop spinner on success
      return res.data;
    } catch (err) {
      // 4. If network fails or server errors, catch it safely
      setError(err.response?.data?.message || 'Failed to analyze food image');
      setLoading(false);
      throw err;
    }
  }, []);

  return { scanFood, loading, error };
};"""
    b.code_block(async_code, filename="client/src/hooks/useNutrition.js", title="Asynchronous Network Request with async / await")

    b.exercise_box("Chapter 6: Modern JavaScript", [
        "In `server/controllers/nutritionController.js`, why does the accumulator object in `reduce()` initialize with zeroes?",
        "What does the optional chaining operator `?.` do in `meal.totals?.calories`? What happens if `meal.totals` is undefined?",
        "Why is `try...catch` always used around `await` expressions in network calls?"
    ])
    b.page_break()

    # =========================================================
    # CHAPTER 7: REACT – THE ENGINE OF KHANALENS
    # =========================================================
    b.chapter_banner(
        "7",
        "React – The Engine of KhanaLens",
        "Components, props, state, hooks (useState, useEffect, useRef, useAuth), and client-side routing"
    )

    b.section("7.1 What Is React and Why Does KhanaLens Use It?")
    b.p(
        "<b>React</b> is a JavaScript library for building user interfaces created by Meta. Before React, developers had to manually "
        "manipulate the browser's Document Object Model (DOM) using commands like `document.getElementById('calories').innerText = '500'`. "
        "In complex apps, this led to spaghetti code where different parts of the screen got out of sync."
    )
    b.p(
        "React introduces a <b>Declarative Paradigm</b>: you declare how the UI should look for a given state, and when state changes, "
        "React automatically calculates the minimal DOM changes needed using a lightning-fast <b>Virtual DOM</b>."
    )

    b.section("7.2 The Core Building Blocks: Components, Props, and State")
    b.bullet("<b>Components:</b> Self-contained, reusable functions that return UI markup (e.g. `<BottomNav />`, `<FoodCard />`).")
    b.bullet("<b>Props (Properties):</b> Data passed down from parent components to child components, like arguments passed to a function. Props are read-only!")
    b.bullet("<b>State:</b> Internal memory belonging to a component that changes in response to user actions (e.g. camera active boolean, calorie count). When state updates, React re-renders the component.")

    b.section("7.3 React Hooks Deep Dive: Powering KhanaLens")
    b.p(
        "Hooks are special functions that allow functional components to 'hook into' React state and lifecycle features. "
        "Let us examine the hooks used in KhanaLens:"
    )

    hooks_headers = ["React Hook", "Purpose", "Real KhanaLens Example", "File Location"]
    hooks_rows = [
        [
            "`useState`",
            "Stores local component state that triggers re-rendering when updated.",
            "`const [selectedFile, setSelectedFile] = useState(null);` holds user uploaded food photo.",
            "`client/src/pages/Scan.jsx`"
        ],
        [
            "`useEffect`",
            "Executes side effects (network requests, event listeners, camera stream setup) after rendering.",
            "Starts camera stream when `cameraActive` becomes true, and stops video tracks on cleanup.",
            "`client/src/pages/Scan.jsx`"
        ],
        [
            "`useRef`",
            "Holds a direct mutable reference to a DOM element without causing a re-render when changed.",
            "`const videoRef = useRef(null);` attaches directly to the HTML5 `<video>` camera viewfinder.",
            "`client/src/pages/Scan.jsx`"
        ],
        [
            "`useCallback`",
            "Memoizes a function definition so it is not re-created on every single render.",
            "`const scanFood = useCallback(async (...) => {...}, []);` prevents unnecessary effect triggers.",
            "`client/src/hooks/useNutrition.js`"
        ],
        [
            "`useContext`",
            "Accesses global shared state without passing props through 10 intermediate components.",
            "`const { user, token, logout } = useAuth();` accesses global user session.",
            "`client/src/context/AuthContext.jsx`"
        ]
    ]
    b.table(hooks_headers, hooks_rows, [85, 125, 175, 130])

    b.section("7.4 Global State Management: AuthContext & ProtectedRoute")
    b.p(
        "How does KhanaLens know if a user is logged in, and prevent unauthorized visitors from viewing `/home` or `/profile`? "
        "This is handled by <b>React Context</b> and <b>ProtectedRoute</b> in `client/src/App.jsx`:"
    )

    auth_route_code = """// client/src/App.jsx (Lines 27-32)
function ProtectedRoute() {
  const { user, token } = useAuth();
  const location = useLocation();

  // If user is not authenticated, redirect to /login and remember where they were trying to go!
  if (!user || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If authenticated, render the child route (e.g. /home, /scan, /history)
  return <Outlet />;
}"""
    b.code_block(auth_route_code, filename="client/src/App.jsx", title="ProtectedRoute: Securing Pages in React Router v7")

    b.p(
        "<b>Line-by-Line Breakdown:</b>\n"
        "• <b>Line 2:</b> `useAuth()` extracts `user` and `token` from `AuthContext`.\n"
        "• <b>Line 6-8:</b> If either `user` or `token` is missing, `<Navigate to=\"/login\" replace />` immediately redirects the browser to the login screen.\n"
        "• <b>Line 11:</b> `<Outlet />` is a special React Router component that renders whatever sub-page the user requested (such as `/home` or `/scan`)."
    )

    b.callout(
        "Why the `key` prop matters in React Lists: When rendering arrays with `.map()`, React requires a unique `key` prop "
        "on the outermost element (e.g. `<div key={item.id}>`). The key acts as an ID badge. If you delete an item from the middle "
        "of a list, the key tells React exactly which element was removed, avoiding expensive full-page re-renders!",
        title="REACT PERFORMANCE TIP",
        kind="important"
    )

    b.exercise_box("Chapter 7: React Engine", [
        "In `client/src/App.jsx`, trace what happens if a user navigates to `/profile` without logging in.",
        "Look at `client/src/components/DokoMascot.jsx`. Which hook triggers the occasional 7-second idle jump animation?",
        "Why is `useRef` used for the HTML5 `<video>` tag in `Scan.jsx` instead of `useState`?"
    ])
    b.page_break()
