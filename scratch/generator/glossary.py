# glossary.py - Comprehensive Technical Glossary of Terms
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, PageBreak
from .styles import escape_xml

def build_glossary(b):
    styles = b.styles

    # =========================================================
    # GLOSSARY OF TECHNICAL TERMS
    # =========================================================
    b.chapter_banner(
        "GLOSSARY",
        "Comprehensive Technical Dictionary",
        "Over 50 plain-English definitions of essential software engineering terminology"
    )

    b.p(
        "Refer to this glossary whenever you encounter an unfamiliar technical word while reading code or discussing features:"
    )
    b.spacer(4)

    glossary_data = [
        ["API (Application Programming Interface)", "A formalized set of rules and URLs that allows two software programs (like your React frontend and your Express backend) to communicate and exchange data."],
        ["Async / Await", "Modern JavaScript syntax that pauses the execution of an asynchronous function until a Promise resolves, without freezing the browser UI."],
        ["Autoplay Policy", "Browser security and user experience rules (especially on mobile) that block videos from playing automatically unless they are muted (`muted={true}`) and inline (`playsInline={true}`)."],
        ["Base64", "A binary-to-text encoding scheme that translates raw file data (like JPEG image bytes) into a long ASCII text string that can be sent inside JSON."],
        ["Box Model", "The foundational CSS layout concept that every HTML element is composed of four concentric rectangles: Content, Padding, Border, and Margin."],
        ["Bundle / Bundling", "The process performed by tools like Vite and Rollup that takes dozens of separate JavaScript and CSS files and combines them into optimized, minified production files."],
        ["Canvas (HTML5)", "An HTML element (`<canvas>`) used to draw graphics, manipulate pixels, or downscale and compress camera photos in browser memory before uploading."],
        ["CDN (Content Delivery Network)", "A globally distributed network of edge proxy servers that caches static files (images, JS, CSS) near users for ultra-fast loading."],
        ["Client", "The software running on the user's local device (the web browser or mobile phone) that renders the user interface."],
        ["Component", "A self-contained, reusable piece of code in React that governs its own markup, styling, and behavior (e.g. `<BottomNav />`)."],
        ["CORS (Cross-Origin Resource Sharing)", "A browser security mechanism that blocks web pages from making API requests to a different domain or port unless the server explicitly permits it."],
        ["CRUD", "An acronym for the four basic database operations: Create (POST), Read (GET), Update (PUT/PATCH), and Delete (DELETE)."],
        ["CSS Grid", "A two-dimensional CSS layout engine designed for organizing content into rows and columns simultaneously."],
        ["CSS Variables (Custom Properties)", "Values defined in CSS (such as `--kl-green: #1F4D33;`) that can be reused throughout an entire stylesheet and updated dynamically."],
        ["DOM (Document Object Model)", "The live tree-like structure of HTML elements in computer memory that the browser renders on screen."],
        ["dvh (Dynamic Viewport Height)", "A modern CSS unit equal to 1% of the actual visible viewport height, dynamically adjusting when mobile address bars collapse or expand."],
        ["Endpoint", "A specific URL path provided by an API where clients can send requests to perform actions (e.g. `/api/nutrition/scan`)."],
        ["Firebase Auth", "A cloud identity and authentication service by Google that handles user sign-in, token issuance, and password security."],
        ["Firestore", "A cloud-hosted NoSQL document database by Google that stores application data in collections and JSON documents."],
        ["Flexbox", "A one-dimensional CSS layout model designed to distribute space and align items along a single row or column."],
        ["FormData", "A JavaScript object used to construct key/value pairs representing HTML form fields, required when uploading binary files (images/videos)."],
        ["Git", "A distributed command-line version control system that tracks file modifications and manages code history."],
        ["GitHub", "A cloud platform hosting Git repositories, providing collaboration tools, issue tracking, and deployment hooks."],
        ["Glassmorphism", "A UI design trend characterized by translucent, frosted-glass surfaces using `backdrop-filter: blur()` and subtle borders."],
        ["Hook (React)", "A specialized JavaScript function (like `useState` or `useEffect`) allowing functional components to access React state and lifecycle."],
        ["HTTP (HyperText Transfer Protocol)", "The foundational communication protocol used for transmitting web pages, images, and API data across the internet."],
        ["Idempotent", "An API property meaning that making multiple identical requests has the exact same effect as making a single request (e.g. `GET`, `PUT`, `DELETE`)."],
        ["JSON (JavaScript Object Notation)", "A lightweight text format for exchanging structured data between computers (e.g. `{\"calories\": 520}`)."],
        ["JWT (JSON Web Token)", "A compact, URL-safe means of representing claims securely between two parties, cryptographically signed with a secret or private key."],
        ["Key (React)", "A special string attribute required when rendering lists of elements in React that helps React identify which items have changed, added, or removed."],
        ["Middleware", "Functions in Express.js that sit between an incoming network request and the final route controller, used for authentication, logging, and error handling."],
        ["Monorepo", "A single software repository holding multiple distinct projects, packages, or services (e.g. KhanaLens containing both `client/` and `server/`)."],
        ["Multer", "A Node.js middleware for handling `multipart/form-data`, primarily used for receiving uploaded image files."],
        ["NoSQL", "Non-relational databases (like Firestore) that store data in flexible documents or key-value pairs rather than rigid tabular schemas."],
        ["npm (Node Package Manager)", "The default package manager for JavaScript, used to install, share, and manage external code libraries."],
        ["Package.json", "The central manifest file in a Node.js project that defines dependencies, version numbers, scripts, and metadata."],
        ["Portal (React)", "A way to render a component's HTML into a DOM node that exists outside the parent component's hierarchy (e.g. `BottomNav` rendered directly on `document.body`)."],
        ["Promise", "A JavaScript object representing the eventual completion (or failure) of an asynchronous operation and its resulting value."],
        ["Props (Properties)", "Read-only arguments passed from a parent React component to a child component to customize its rendering."],
        ["PWA (Progressive Web App)", "A web application built with modern APIs to provide native app capabilities, including offline access, home screen installation, and camera feeds."],
        ["React", "A declarative, component-based JavaScript library developed by Meta for building dynamic user interfaces."],
        ["Ref (React useRef)", "A container object whose `.current` property holds a mutable value or direct DOM element reference without triggering re-renders."],
        ["REST", "Representational State Transfer: an architectural style for networked hypermedia applications adhering to stateless client-server conventions."],
        ["Server", "A computer program running in the cloud or locally that listens for network requests, runs business rules, and interacts with databases."],
        ["SPA (Single Page Application)", "A web app that loads a single HTML page and dynamically updates views as the user interacts, eliminating full page reloads."],
        ["State (React)", "A component's private, reactive memory. When state updates, React automatically recalculates and re-renders the component."],
        ["Tailwind CSS", "A utility-first CSS framework that allows developers to style elements directly inside HTML/JSX using pre-defined class names."],
        ["TypeScript", "A strongly typed superset of JavaScript developed by Microsoft that adds compile-time type checking."],
        ["Vite", "A blazing-fast modern frontend build tool that leverages native ES modules in development and Rollup for production bundling."],
        ["Virtual DOM", "A lightweight in-memory representation of the real browser DOM used by React to compute efficient UI updates."],
        ["WebM", "An open-source royalty-free media container format designed for the web that uniquely supports video transparency via an 8-bit alpha channel."],
        ["WebRTC", "Web Real-Time Communication: browser standards that enable live audio, video, and data streaming (e.g. phone camera access via `getUserMedia`)."],
        ["Z-Index", "A CSS property that specifies the stack order of positioned elements along the imaginary 3D axis perpendicular to the screen."]
    ]

    glossary_headers = ["Technical Term", "Plain-English Definition & Real-World Context"]
    b.table(glossary_headers, glossary_data, [140, 375])
    b.spacer(10)

    b.callout(
        "Congratulations! You now have a complete, reference-grade technical handbook explaining every single "
        "technology, file, design decision, and line of logic inside your application. "
        "Keep this PDF on your desktop or tablet as your constant software engineering companion.",
        title="HANDBOOK CONCLUSION",
        kind="note"
    )
