# build_15page_handbook.py - Generates an ultra-simple, 15-page handbook for KhanaLens
import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image as RLImage, Preformatted
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas
import xml.sax.saxutils as saxutils

# ---------------------------------------------------------
# Colors & Typography
# ---------------------------------------------------------
COLOR_PRIMARY = HexColor('#1F4D33')        # Dark Forest Green
COLOR_MINT = HexColor('#3FA47A')           # Active Mint
COLOR_CREAM = HexColor('#FBF7EE')          # Cream Background
COLOR_BEIGE = HexColor('#F7F1E4')          # Soft Card Background
COLOR_TEXT = HexColor('#1F2937')           # Charcoal Body Text
COLOR_MUTED = HexColor('#4B5563')          # Subtitle Gray
COLOR_BORDER = HexColor('#D1E2D8')         # Card Border
COLOR_CODE_BG = HexColor('#141E18')        # Code Background
COLOR_CODE_TEXT = HexColor('#E2E8F0')      # Off-white Code Text
COLOR_NOTE_BG = HexColor('#F0FDF4')        # Light Green
COLOR_TIP_BG = HexColor('#EFF6FF')         # Light Blue
COLOR_WARN_BG = HexColor('#FFFBEB')        # Light Amber

def escape_xml(text):
    return saxutils.escape(str(text)) if text else ""

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            if self._pageNumber > 1:
                self.saveState()
                # Running Header
                self.setFont('Helvetica-Bold', 8)
                self.setFillColor(COLOR_PRIMARY)
                self.drawString(40, 808, "KHANALENS – SIMPLE SOFTWARE DEVELOPMENT HANDBOOK")
                self.setFont('Helvetica-Oblique', 8)
                self.setFillColor(COLOR_MUTED)
                self.drawRightString(555, 808, "A Beginner-Friendly Guide to Your App")
                
                # Rule lines
                self.setStrokeColor(COLOR_BORDER)
                self.setLineWidth(0.6)
                self.line(40, 800, 555, 800)
                self.line(40, 42, 555, 42)
                
                # Running Footer
                self.setFont('Helvetica', 8)
                self.setFillColor(COLOR_MUTED)
                self.drawString(40, 30, "KhanaLens Nutrition App • Simple 15-Page Learning Handbook")
                self.setFont('Helvetica-Bold', 8)
                self.setFillColor(COLOR_PRIMARY)
                self.drawRightString(555, 30, f"Page {self._pageNumber} of {num_pages}")
                self.restoreState()
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

def get_styles():
    base = getSampleStyleSheet()
    s = {}
    s['CoverTitle'] = ParagraphStyle('CoverTitle', fontName='Helvetica-Bold', fontSize=24, leading=28, textColor=COLOR_PRIMARY, spaceAfter=8)
    s['CoverSubtitle'] = ParagraphStyle('CoverSubtitle', fontName='Helvetica', fontSize=12, leading=16, textColor=COLOR_MUTED, spaceAfter=14)
    s['PageHeader'] = ParagraphStyle('PageHeader', fontName='Helvetica-Bold', fontSize=15, leading=18, textColor=COLOR_PRIMARY, spaceAfter=2)
    s['PageSubheader'] = ParagraphStyle('PageSubheader', fontName='Helvetica-Oblique', fontSize=9, leading=12, textColor=COLOR_MUTED, spaceAfter=8)
    s['SectionTitle'] = ParagraphStyle('SectionTitle', fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=COLOR_PRIMARY, spaceBefore=4, spaceAfter=2)
    s['Body'] = ParagraphStyle('Body', fontName='Helvetica', fontSize=8.5, leading=11.5, textColor=COLOR_TEXT, spaceAfter=4)
    s['BodyBold'] = ParagraphStyle('BodyBold', fontName='Helvetica-Bold', fontSize=8.5, leading=11.5, textColor=COLOR_TEXT, spaceAfter=4)
    s['Bullet'] = ParagraphStyle('Bullet', fontName='Helvetica', fontSize=8.3, leading=11.2, textColor=COLOR_TEXT, leftIndent=12, firstLineIndent=-8, spaceAfter=2)
    s['CodeText'] = ParagraphStyle('CodeText', fontName='Courier', fontSize=7.2, leading=9.0, textColor=COLOR_CODE_TEXT)
    s['CodeTitle'] = ParagraphStyle('CodeTitle', fontName='Courier-Bold', fontSize=7.8, leading=9.5, textColor=COLOR_MINT)
    s['CalloutTitle'] = ParagraphStyle('CalloutTitle', fontName='Helvetica-Bold', fontSize=8.8, leading=11, textColor=COLOR_PRIMARY, spaceAfter=2)
    s['CalloutText'] = ParagraphStyle('CalloutText', fontName='Helvetica', fontSize=8.0, leading=10.8, textColor=COLOR_TEXT)
    s['TableHeader'] = ParagraphStyle('TableHeader', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=HexColor('#FFFFFF'))
    s['TableCell'] = ParagraphStyle('TableCell', fontName='Helvetica', fontSize=7.6, leading=9.8, textColor=COLOR_TEXT)
    s['TableCellBold'] = ParagraphStyle('TableCellBold', fontName='Helvetica-Bold', fontSize=7.6, leading=9.8, textColor=COLOR_TEXT)
    return s

class SimpleBuilder:
    def __init__(self, styles):
        self.styles = styles
        self.story = []

    def banner(self, page_num, title, subtitle):
        content = [
            Paragraph(f"<b>LESSON {page_num}: {escape_xml(title.upper())}</b>", self.styles['PageHeader']),
            Paragraph(escape_xml(subtitle), self.styles['PageSubheader'])
        ]
        t = Table([[content]], colWidths=[515])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), COLOR_CREAM),
            ('BOX', (0,0), (-1,-1), 0.8, COLOR_BORDER),
            ('LINELEFT', (0,0), (-1,-1), 4, COLOR_PRIMARY),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ]))
        self.story.append(t)
        self.story.append(Spacer(1, 6))

    def p(self, text):
        self.story.append(Paragraph(escape_xml(text), self.styles['Body']))

    def section(self, title):
        self.story.append(Paragraph(f"<b>{escape_xml(title)}</b>", self.styles['SectionTitle']))

    def bullet(self, text):
        self.story.append(Paragraph(f"• {escape_xml(text)}", self.styles['BulletItem'] if 'BulletItem' in self.styles else self.styles['Bullet']))

    def callout(self, title, text, kind="tip"):
        bg = COLOR_TIP_BG if kind == "tip" else (COLOR_NOTE_BG if kind == "note" else COLOR_WARN_BG)
        border = COLOR_MINT if kind in ["tip", "note"] else HexColor('#F59E0B')
        icon = "💡" if kind == "tip" else ("ℹ️" if kind == "note" else "⚠️")
        content = [
            Paragraph(f"<b>{icon} {escape_xml(title)}</b>", self.styles['CalloutTitle']),
            Paragraph(escape_xml(text), self.styles['CalloutText'])
        ]
        t = Table([[content]], colWidths=[515])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg),
            ('BOX', (0,0), (-1,-1), 0.7, border),
            ('LINELEFT', (0,0), (-1,-1), 3.5, border),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        self.story.append(t)
        self.story.append(Spacer(1, 4))

    def code(self, code_str, filename="", title=""):
        lines = code_str.strip().split('\n')
        fmt = [f"{i:2d} | {line}" for i, line in enumerate(lines, 1)]
        pref = Preformatted(escape_xml('\n'.join(fmt)), self.styles['CodeText'])
        head = Paragraph(f"📄 <b>{escape_xml(filename or title)}</b>", self.styles['CodeTitle'])
        t = Table([[head], [pref]], colWidths=[515])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), HexColor('#1D2E24')),
            ('BACKGROUND', (0,1), (-1,1), COLOR_CODE_BG),
            ('BOX', (0,0), (-1,-1), 0.8, COLOR_PRIMARY),
            ('LINEBELOW', (0,0), (-1,0), 0.8, COLOR_MINT),
            ('TOPPADDING', (0,0), (-1,0), 3),
            ('BOTTOMPADDING', (0,0), (-1,0), 3),
            ('LEFTPADDING', (0,0), (-1,0), 8),
            ('TOPPADDING', (0,1), (-1,1), 4),
            ('BOTTOMPADDING', (0,1), (-1,1), 4),
            ('LEFTPADDING', (0,1), (-1,1), 8),
        ]))
        self.story.append(t)
        self.story.append(Spacer(1, 4))

    def table(self, headers, rows, widths=None):
        if not widths:
            widths = [515.0 / len(headers)] * len(headers)
        h_cells = [Paragraph(f"<b>{escape_xml(h)}</b>", self.styles['TableHeader']) for h in headers]
        data = [h_cells]
        for r_idx, row in enumerate(rows):
            r_cells = []
            for c_idx, cell in enumerate(row):
                if c_idx == 0:
                    r_cells.append(Paragraph(escape_xml(cell), self.styles['TableCellBold']))
                else:
                    r_cells.append(Paragraph(escape_xml(cell), self.styles['TableCell']))
            data.append(r_cells)
        t = Table(data, colWidths=widths, repeatRows=1)
        t_style = [
            ('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY),
            ('BOX', (0,0), (-1,-1), 0.6, COLOR_BORDER),
            ('INNERGRID', (0,0), (-1,-1), 0.4, COLOR_BORDER),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
            ('LEFTPADDING', (0,0), (-1,-1), 5),
            ('RIGHTPADDING', (0,0), (-1,-1), 5),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]
        for i in range(1, len(data)):
            t_style.append(('BACKGROUND', (0, i), (-1, i), COLOR_BEIGE if i % 2 == 0 else HexColor('#FFFFFF')))
        t.setStyle(TableStyle(t_style))
        self.story.append(t)
        self.story.append(Spacer(1, 4))

    def spacer(self, h=6):
        self.story.append(Spacer(1, h))

    def page_break(self):
        self.story.append(PageBreak())

print("Helper classes initialized")

def generate_all_15_pages(b):
    # =========================================================
    # PAGE 1: COVER PAGE
    # =========================================================
    b.spacer(15)
    header_ribbon = Table([
        [
            Paragraph("<b>KHANALENS SIMPLE LEARNING HANDBOOK</b>", b.styles['TableCellBold']),
            Paragraph("<b>15-PAGE BEGINNER EDITION • 2026</b>", b.styles['TableCell'])
        ]
    ], colWidths=[270, 245])
    header_ribbon.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_CREAM),
        ('BOX', (0,0), (-1,-1), 0.8, COLOR_BORDER),
        ('LINEBOTTOM', (0,0), (-1,-1), 2, COLOR_PRIMARY),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    b.story.append(header_ribbon)
    b.spacer(20)

    # Logo
    logo_path = 'client/src/assets/images/KhanaLens.png'
    if not os.path.exists(logo_path):
        logo_path = 'client/public/Khanalens-Logo-round.png'
    if os.path.exists(logo_path):
        try:
            b.story.append(RLImage(logo_path, width=70, height=70))
            b.spacer(12)
        except Exception:
            pass

    b.story.append(Paragraph("KHANALENS – SIMPLE SOFTWARE DEVELOPMENT HANDBOOK", b.styles['CoverTitle']))
    b.story.append(Paragraph("Understanding How My Application Is Built – In Plain, Everyday Language", b.styles['CoverSubtitle']))
    
    rule = Table([[""]], colWidths=[515], rowHeights=[2])
    rule.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), COLOR_MINT)]))
    b.story.append(rule)
    b.spacer(14)

    b.callout(
        "Welcome to Your Real Codebase!",
        "Until now, you used AI prompts to build KhanaLens. This handbook was created by inspecting your real source "
        "files. Across these 15 simple pages, you will learn how your buttons click, how your camera scans food, "
        "how Google Gemini calculates calories, and how to change things yourself without feeling lost.",
        kind="tip"
    )
    b.spacer(12)

    meta_table = Table([
        [Paragraph("<b>Application:</b>", b.styles['TableCellBold']), Paragraph("KhanaLens – AI Nutrition & Health Habit Tracker for Nepal", b.styles['TableCell'])],
        [Paragraph("<b>The Tech Stack:</b>", b.styles['TableCellBold']), Paragraph("React 19, Tailwind CSS, Node.js, Express, Google Gemini AI, Firebase", b.styles['TableCell'])],
        [Paragraph("<b>Target Audience:</b>", b.styles['TableCellBold']), Paragraph("Complete Beginner who wants to understand and edit their own code", b.styles['TableCell'])],
        [Paragraph("<b>Format:</b>", b.styles['TableCellBold']), Paragraph("15 Easy Lessons with real files, diagrams, and line-by-line instructions", b.styles['TableCell'])],
    ], colWidths=[110, 405])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_CREAM),
        ('BOX', (0,0), (-1,-1), 0.8, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.4, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
    ]))
    b.story.append(meta_table)
    b.spacer(25)
    b.p("<i>“You don't need a computer science degree to build great software. You just need curiosity.”</i>")
    b.page_break()

    # =========================================================
    # PAGE 2: THE BIG PICTURE & TABLE OF CONTENTS
    # =========================================================
    b.banner(1, "The Big Picture & Table of Contents", "How KhanaLens works in simple words, and your guide to this handbook")
    
    b.section("1. What Is KhanaLens in 30 Seconds?")
    b.p("KhanaLens is like Shazam or Google Lens, but crafted for Nepali and South Asian food. You take a photo of your plate (like Dal Bhat or Momo), Google Gemini AI identifies what is on the plate, calculates calories and protein, and your mascot Doko tracks your health streak.")
    
    b.section("2. How the 3 Main Parts Talk to Each Other")
    b.bullet("<b>1. The Screen (Frontend / React):</b> What you see and touch on your phone. Buttons, mascot, and camera.")
    b.bullet("<b>2. The Helper (Backend / Express):</b> Works invisibly. Hides your passwords and sends photos to the AI safely.")
    b.bullet("<b>3. The Brain & Notebook (Gemini AI & Firebase):</b> Gemini calculates the calories; Firebase saves your meal history.")

    b.spacer(4)
    b.section("3. What Is in This 15-Page Handbook?")
    toc_data = [
        ["Page 3", "How Software Works & KhanaLens Architecture", "The 10 steps of building an app & the journey of a food photo."],
        ["Page 4", "The 4 Web Languages Made Simple", "HTML (bones), CSS (skin), JavaScript (muscles), and React/JSX."],
        ["Page 5", "Building the Screen (App Frame & CSS)", "Mobile phone frame on desktop, `100dvh`, and KhanaLens colors."],
        ["Page 6", "JavaScript & React (State & Hooks)", "How buttons work, component state, and the 3 hooks you must know."],
        ["Page 7", "Welcome Screen, Login & Dashboard", "Walkthrough of LandingPage.jsx, Login.jsx, and Home.jsx."],
        ["Page 8", "Smart Food Scanner & Doko Mascot", "WebRTC camera, shrinking photos, and Doko jumping physics."],
        ["Page 9", "Today's Summary, Macros & Streak", "Calorie ring, protein/carbs/fat progress bars, and streak math."],
        ["Page 10", "7-Day Meal Plan & Partner Sponsors", "Gemini 7-day planner, 3-day cooldown timer, and sponsor carousel."],
        ["Page 11", "Videos, Animations & Media Rules", "WebM transparency, iPhone autoplay rules, and canvas downsampling."],
        ["Page 12", "Where Files Live & The Backend", "Tour of client/server folders, REST APIs, and Firestore database."],
        ["Page 13", "Git, npm & Real Problems Solved", "Code time machine, package.json, and real bugs solved in KhanaLens."],
        ["Page 14", "Putting KhanaLens on the Internet", "Dev vs production, Vercel hosting, and keeping API keys secure."],
        ["Page 15", "Your Simple Learning Roadmap", "The 4-stage beginner plan and 5 fun coding tasks you can do today!"]
    ]
    b.table(["Page", "Topic", "What You Will Learn"], toc_data, [45, 175, 295])
    b.callout("Study Tip", "Keep your code editor open while reading. When you see a filename mentioned, open it and look at the line numbers!", kind="tip")
    b.page_break()

    # =========================================================
    # PAGE 3: CHAPTERS 1 & 2: ARCHITECTURE & THE FOOD JOURNEY
    # =========================================================
    b.banner(2, "How Software Works & KhanaLens Architecture", "The restaurant analogy and the 7-step journey of a food scan")
    
    b.section("1. The Himalayan Restaurant Analogy")
    b.p("Every modern software application works exactly like a restaurant in Kathmandu:")
    b.bullet("<b>The Dining Room & Menu (Frontend):</b> The tables, lights, and printed menu. What the customer sees.")
    b.bullet("<b>The Waiter (REST API):</b> Takes your order slip to the kitchen and brings back the cooked dish.")
    b.bullet("<b>The Kitchen & Chefs (Backend):</b> Prepares the food following recipes. Keeps hot stoves safe from customers.")
    b.bullet("<b>The Cold Storage Pantry (Database):</b> Where ingredients, spices, and leftovers are neatly labeled on shelves.")

    b.section("2. The 7-Step Journey of a Food Scan")
    b.p("Here is exactly what happens in under 2 seconds when you tap 'Capture' on a plate of food:")
    journey_data = [
        ["Step 1", "Your Phone", "You open the camera in `Scan.jsx` and tap Capture."],
        ["Step 2", "Image Shrink", "`imageCompression.js` resizes the photo from 10MB down to 400KB so it uploads quickly."],
        ["Step 3", "Network Trip", "Your phone sends the photo to `/api/nutrition/scan` on your backend server."],
        ["Step 4", "Security Guard", "`authMiddleware.js` verifies your login token using Google's security certificates."],
        ["Step 5", "AI Analysis", "`geminiService.js` sends the photo to Google Gemini AI with instructions for Nepali dishes."],
        ["Step 6", "Saving the Meal", "`firestoreService.js` saves the meal in Cloud Firestore (or in-memory if offline)."],
        ["Step 7", "Result on Screen", "Your phone opens `FoodAnalysisResult.jsx`, displaying calories and nutrition pills!"]
    ]
    b.table(["Step", "Where it Happens", "What Takes Place Under the Hood"], journey_data, [45, 110, 360])

    b.callout(
        "Why Not Call AI Directly from the Phone?",
        "If you put your Google Gemini API key inside the frontend React app, any visitor could right-click, "
        "inspect the code, steal your key, and use up your credit card. Putting the key on the backend keeps it safe!",
        kind="warn"
    )
    b.page_break()

    # =========================================================
    # PAGE 4: CHAPTER 3: THE 4 WEB LANGUAGES
    # =========================================================
    b.banner(3, "The 4 Web Languages Made Simple", "HTML, CSS, JavaScript, and React/JSX explained with real examples")
    
    b.section("1. The 4 Web Languages & Their Jobs")
    b.table(
        ["Language", "Human Body Analogy", "What It Does in KhanaLens"],
        [
            ["HTML", "The Skeleton", "Creates buttons, headings, text boxes, and video tags (`<h1>`, `<button>`)."],
            ["CSS", "The Skin & Clothes", "Controls colors (`#1F4D33`), rounded corners (34px), spacing, and animations."],
            ["JavaScript", "The Muscles & Brain", "Handles clicks, calculates math, starts the camera, and fetches data."],
            ["React / JSX", "The Whole Human", "Combines HTML and JavaScript together so screens update instantly."]
        ],
        [80, 115, 320]
    )

    b.section("2. Real Code Spotlight: BrandLogo.jsx")
    b.p("Look at `client/src/components/BrandLogo.jsx`. It combines JavaScript variables with SVG drawing tags:")
    code_logo = """// client/src/components/BrandLogo.jsx
export default function BrandLogo({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {/* 1. Dark green rounded square badge */}
      <rect width="100" height="100" rx="28" fill="#1F4D33" />
      {/* 2. Mint green leaf shape in center */}
      <path d="M50 20C35 20 25 35 25 50C25 65 35 80 50 80C65 80 75 65 75 50C75 35 65 20 50 20Z" fill="#3FA47A" />
    </svg>
  );
}"""
    b.code(code_logo, filename="client/src/components/BrandLogo.jsx")

    b.p("<b>Notice:</b> `rx=\"28\"` gives the square rounded corners, and `fill=\"#1F4D33\"` paints it our signature forest green.")
    b.callout(
        "Try This Small Change!",
        "Open `BrandLogo.jsx` in your code editor. Change `fill=\"#3FA47A\"` to `fill=\"#E08E45\"` (orange). "
        "Save the file, and watch the center leaf turn orange instantly!",
        kind="tip"
    )
    b.page_break()

    # =========================================================
    # PAGE 5: CHAPTERS 4 & 5: BUILDING THE SCREEN
    # =========================================================
    b.banner(4, "Building the Screen (App Frame & CSS)", "How KhanaLens looks like a smartphone app and handles layout")
    
    b.section("1. Why KhanaLens Looks Like a Phone on Desktop")
    b.p("If you open KhanaLens on a wide desktop screen, it doesn't stretch like an ugly spreadsheet. In `theme.css`, we restrict the frame to 420 pixels wide and center it with smooth rounded edges:")
    code_frame = """/* client/src/styles/theme.css */
.kl-app-frame {
  max-width: 420px;          /* Stays phone-sized on computers */
  min-height: 100dvh;        /* Fills screen height perfectly */
  margin: 0 auto;            /* Centers horizontally on desktop */
  background: linear-gradient(170deg, #FBF8F0 0%, #F7F1E4 60%, #F2EADA 100%);
}"""
    b.code(code_frame, filename="client/src/styles/theme.css")

    b.section("2. The CSS Box Model: Margin, Border, Padding")
    b.bullet("<b>Content:</b> The actual words, picture, or icon.")
    b.bullet("<b>Padding:</b> The inner breathing room between the words and the edge of the card.")
    b.bullet("<b>Border:</b> The visible line around the card (e.g. `1px solid #D1E2D8`).")
    b.bullet("<b>Margin:</b> The outer space between this card and other cards.")

    b.section("3. The KhanaLens Color Palette")
    b.table(
        ["Color Name", "Hex Code", "Where It Is Used in Your App"],
        [
            ["Forest Green", "`#1F4D33`", "Main brand color, primary buttons, headings, and bold text."],
            ["Mint Green", "`#3FA47A`", "Active buttons, camera capture ring, protein progress bar."],
            ["Warm Cream", "`#FBF7EE`", "Background color behind all cards and screens."],
            ["Soft Beige", "`#F7F1E4`", "Card background for meals, goals, and sponsor banners."]
        ],
        [90, 85, 340]
    )

    b.callout(
        "What is 100dvh?",
        "On phones, the URL bar moves up and down when you scroll. Traditional `100vh` ignores this, "
        "pushing buttons off the bottom of the screen. `100dvh` (Dynamic Viewport Height) automatically adapts!",
        kind="tip"
    )
    b.page_break()

    # =========================================================
    # PAGE 6: CHAPTERS 6 & 7: JAVASCRIPT & REACT
    # =========================================================
    b.banner(5, "JavaScript & React (State & Hooks)", "How buttons work, how React remembers things, and the 3 hooks to know")
    
    b.section("1. How React Thinks: State & Re-rendering")
    b.p("In old-school websites, when a value changed, you had to manually find the HTML tag and replace the text. React is much smarter: you give your component <b>State</b> (its live memory). Whenever state changes, React updates the screen automatically in milliseconds.")

    b.section("2. The 3 Essential React Hooks in KhanaLens")
    b.table(
        ["Hook Name", "In Simple Words", "Real Example in KhanaLens"],
        [
            ["`useState`", "The component's notebook. Remembers values that can change.", "Remembers if the camera is currently ON or OFF in `Scan.jsx`."],
            ["`useEffect`", "Does something automatically after the screen loads.", "Starts the 7-second idle jump timer for Doko in `DokoMascot.jsx`."],
            ["`useRef`", "Grabs a physical screen element directly.", "Holds onto the HTML5 `<video>` camera viewfinder in `Scan.jsx`."]
        ],
        [85, 160, 270]
    )

    b.section("3. ProtectedRoute: Keeping Strangers Out")
    b.p("In `client/src/App.jsx`, we protect private screens (like `/home` and `/profile`) using `ProtectedRoute`:")
    code_protect = """// client/src/App.jsx
function ProtectedRoute() {
  const { user, token } = useAuth();
  // If user is not logged in, kick them back to the login page!
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />; // Otherwise, show them the requested page!
}"""
    b.code(code_protect, filename="client/src/App.jsx")

    b.callout(
        "Array Methods: map() and filter()",
        "Whenever KhanaLens displays a list (like your recent meals or navigation tabs), it uses `.map()`. "
        "Think of `.map()` like a factory conveyor belt: it takes a list of data and turns each item into a clickable card!",
        kind="note"
    )
    b.page_break()

    # =========================================================
    # PAGE 7: CHAPTER 8 (PART 1): WELCOME, LOGIN & DASHBOARD
    # =========================================================
    b.banner(6, "Feature Breakdown: Welcome, Login & Dashboard", "Dissecting LandingPage.jsx, Login.jsx, and Home.jsx")
    
    b.section("1. Welcome Screen (`LandingPage.jsx`)")
    b.p("The first screen visitors see. It plays a smooth video of Doko the mascot in the background, applies a subtle grain texture, and features a prominent 'Get Started' button that guides new users into the app.")
    b.bullet("<b>File:</b> `client/src/pages/LandingPage.jsx`.")
    b.bullet("<b>How to edit:</b> Open line 165 to customize the headline: <i>'Scan. Analyze. Eat Smarter.'</i>")

    b.section("2. Signup and Login (`Login.jsx`)")
    b.p("Allows users to create an account or sign in. Features both traditional email/password fields and a 1-tap Google Sign-In button.")
    b.bullet("<b>Files:</b> `client/src/pages/Login.jsx` and `client/src/services/firebaseAuth.js`.")
    b.bullet("<b>How Google Sign-In works:</b> Calls `signInWithPopup(auth, provider)`. When the user selects their Google account, Firebase returns an ID token that the backend verifies.")

    b.section("3. Main Dashboard (`Home.jsx`)")
    b.p("The main hub after logging in. Displays your profile avatar, greeting, current health streak, calorie progress wheel, quick-scan action button, and partner advertisements.")
    code_home = """// client/src/pages/Home.jsx
export function Home() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(defaultSummary);

  // When screen opens, fetch user profile and today's nutrition
  useEffect(() => {
    Promise.all([getProfileApi(), getProgressApi('week')]).then(([prof, prog]) => {
      setSummary(prog.data.totals);
    });
  }, []);
  ..."""
    b.code(code_home, filename="client/src/pages/Home.jsx")
    b.callout("Dashboard Customization", "To change the default daily calorie goal from 2,000 kcal to 2,200 kcal, edit `defaultSummary` near line 28 in `Home.jsx`.", kind="tip")
    b.page_break()

    # =========================================================
    # PAGE 8: CHAPTER 8 (PART 2): SCANNER & DOKO MASCOT
    # =========================================================
    b.banner(7, "Feature Breakdown: Food Scanner & Doko Mascot", "Dissecting Scan.jsx, image downsampling, and Doko physics")
    
    b.section("1. Smart Food Scanner (`Scan.jsx`)")
    b.p("The camera screen lets users point their phone at a plate of food, snap a photo, or choose a picture from their phone's gallery.")
    b.bullet("<b>Starting Camera:</b> Uses `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })` to request the phone's back camera.")
    b.bullet("<b>Safety Check:</b> The camera only works over secure HTTPS (or localhost) due to browser privacy rules.")
    b.bullet("<b>Capturing:</b> Draws the live camera frame to an invisible HTML5 canvas, downsamples it, and sends it to the AI.")

    b.section("2. Image Compression (`imageCompression.js`)")
    b.p("Modern phones take giant 12MB photos. Uploading a 12MB file on 4G in Nepal would take 15 seconds! `imageCompression.js` resizes the picture to a maximum width of 1280 pixels and sets JPEG quality to 0.75. The photo shrinks to under 500KB in 0.1 seconds!")

    b.section("3. Doko Mascot (`DokoMascot.jsx`)")
    b.p("Doko is a 3D Nepali bird character wearing a traditional Dhaka Topi and hand-weaving a bamboo Doko basket. He jumps when clicked, shows sparkles, and displays encouraging nutrition tips in Nepali.")
    code_doko = """// client/src/components/DokoMascot.jsx
const phrases = [
  'Namaste! 🌾',
  'Khana scan garihalnu hos! 📸',
  'Healthy khana, healthy life! 🥗',
  'Doko is crafting your health! 🚀'
];"""
    b.code(code_doko, filename="client/src/components/DokoMascot.jsx")
    b.callout("Make Doko Say Your Name!", "Open `client/src/components/DokoMascot.jsx`, find the `phrases` array around line 68, and add your own custom messages!", kind="tip")
    b.page_break()

    # =========================================================
    # PAGE 9: CHAPTER 8 (PART 3): SUMMARY, MACROS & STREAK
    # =========================================================
    b.banner(8, "Feature Breakdown: Today's Summary & Streak", "Calorie ring math, protein/carbs/fat indicators, and habit streaks")
    
    b.section("1. Today's Calorie Summary Wheel")
    b.p("On the dashboard, a circular radial ring displays how many calories you have eaten today compared to your daily goal.")
    b.bullet("<b>Percentage Math:</b> `const percent = Math.min(100, Math.round((calories / calorieGoal) * 100));`")
    b.bullet("<b>Remaining Calories:</b> `const remaining = Math.max(0, calorieGoal - calories);`")
    b.bullet("<b>Smooth Animation:</b> Uses CSS custom property `@property --progress` to animate the ring angle from 0 to 360 degrees.")

    b.section("2. Macronutrient Indicators (Protein, Carbs, Fat)")
    b.p("Three horizontal progress bars display the building blocks of nutrition with distinct health colors:")
    b.table(
        ["Nutrient", "Color Used", "Why It Matters", "Default Goal"],
        [
            ["Protein", "Mint Green (`#3FA47A`)", "Muscle repair, strength, and satiety.", "120 grams"],
            ["Carbs", "Soft Orange (`#E08E45`)", "Primary daily energy source for brain and body.", "250 grams"],
            ["Fat", "Soft Sky Blue (`#4A90E2`)", "Hormone balance and vitamin absorption.", "70 grams"]
        ],
        [75, 110, 240, 90]
    )

    b.section("3. Streak Tracking Engine (`streak.js`)")
    b.p("KhanaLens keeps you motivated by tracking how many days in a row you have logged meals. In `client/src/data/streak.js`, the function `calculateStreak()` loops backward through your recent days. If today and yesterday have logged meals, your streak increases!")

    b.callout("Where are Goals Saved?", "Users can customize their calorie and macro goals inside the Profile Settings screen (`Setting.jsx`). Goals are stored in the Cloud Firestore `profiles` collection.", kind="note")
    b.page_break()

    # =========================================================
    # PAGE 10: CHAPTER 8 (PART 4): MEAL PLAN & SPONSORS
    # =========================================================
    b.banner(9, "Feature Breakdown: 7-Day Plan & Sponsors", "AI meal schedules, 3-day cooldown timer, and sponsor carousel")
    
    b.section("1. 7-Day AI Meal Planner (`MealPlanner.jsx`)")
    b.p("Users can generate a complete 7-day breakfast, lunch, dinner, and snack meal plan tailored to Nepali cuisine and their calorie targets.")
    b.bullet("<b>How Gemini Writes It:</b> The server passes your past favorite meals and health conditions (e.g. vegetarian, high protein) to Gemini AI, which returns structured JSON for Monday through Sunday.")
    b.bullet("<b>The 3-Day Cooldown Guard:</b> Generating 7 days of AI meals uses significant computing power. `mealPlanController.js` enforces a 72-hour countdown timer so users cannot spam the AI button.")

    b.section("2. Featured Partners & Sponsors")
    b.p("KhanaLens includes a monetization and partner sponsorship engine displaying authentic fitness brands:")
    b.bullet("<b>Partners:</b> Jiri Nutrition (jirinu.com - 100% Nepali Whey), MuscleBlaze (muscleblaze.com/nepal - Biozyme Whey), Nepal Organics, Himalayan Whey, Kathmandu Fitness Hub.")
    b.bullet("<b>High-Res Brand Banners:</b> Displays full-bleed graphic advertisement banners with crisp typography, verified badges, and direct links to official partner stores.")
    b.bullet("<b>Click & Impression Telemetry:</b> Tapping 'Shop Jiri' or 'Order Now' opens the partner website in a new tab while logging telemetry on the backend.")

    b.section("3. Automatic Carousel Slider")
    b.p("In `Home.jsx`, the partner banners slide automatically every 5 seconds. If the user touches or hovers their mouse over the card, the timer pauses so they can comfortably read the offer!")

    b.callout("Adding a New Sponsor", "To add a new partner brand, open `server/services/sponsorService.js` and add an entry with a title, image URL, and link.", kind="tip")
    b.page_break()

    # =========================================================
    # PAGE 11: CHAPTER 9: VIDEOS, ANIMATIONS & MEDIA
    # =========================================================
    b.banner(10, "Videos, Animations & Image Optimization", "WebM video transparency, iPhone autoplay rules, and Doko physics")
    
    b.section("1. Why KhanaLens Uses Video Instead of GIFs")
    b.p("Many beginner developers use animated GIFs. But a 3-second high-definition GIF is 15MB in size, has choppy 256 colors, and will crash mobile phone browsers! KhanaLens uses MP4 and WebM video files, which look stunning in 1080p and take only 1MB of data.")

    b.section("2. The WebM Transparency Superpower")
    b.p("Look at `client/public/doko-animated.webm`. WebM has an <b>alpha channel</b> (transparent background). This allows Doko to weave bamboo baskets directly over our cream app background without an ugly white box around him!")

    b.section("3. The 3 Mobile Video Rules (Don't Break These!)")
    b.p("If you want a video to play automatically on iPhones and Androids, your `<video>` tag MUST include these 3 attributes:")
    code_video = """{/* Real video pattern from LandingPage.jsx */}
<video
  autoPlay      /* 1. Starts playing automatically */
  muted         /* 2. STRICTLY REQUIRED: Video must be silent or phones block it! */
  playsInline   /* 3. STRICTLY REQUIRED: Prevents iPhone from forcing full-screen */
  loop          /* Keeps repeating seamlessly */
  poster="/doko-poster.jpg" /* Shows image while video downloads */
>
  <source src="/doko-animated.webm" type="video/webm" />
  <source src="/doko-animated.mp4" type="video/mp4" />
</video>"""
    b.code(code_video, filename="client/src/pages/LandingPage.jsx")
    b.callout("Why Muted is Required", "Apple and Google ban unmuted video autoplay to protect users from loud unexpected sounds and expensive mobile data charges.", kind="warn")
    b.page_break()

    # =========================================================
    # PAGE 12: CHAPTERS 10 & 11: FOLDERS & BACKEND/DATABASE
    # =========================================================
    b.banner(11, "Folder Structure & Backend/Database", "Tour of client and server folders, REST APIs, and Cloud Firestore")
    
    b.section("1. Tour of Your Monorepo Folders")
    b.bullet("<b>`client/src/pages/`:</b> Full-screen pages you can visit (e.g. `Home.jsx`, `Scan.jsx`, `Login.jsx`).")
    b.bullet("<b>`client/src/components/`:</b> Small Lego bricks you reuse across pages (`BottomNav.jsx`, `DokoMascot.jsx`).")
    b.bullet("<b>`client/src/services/`:</b> Network functions that fetch data from the server (`api.js`, `firebaseAuth.js`).")
    b.bullet("<b>`server/controllers/`:</b> The backend brains that process food scans and meal plans.")
    b.bullet("<b>`server/routes/`:</b> The URL roadmap (`/api/nutrition`, `/api/profile`, `/api/sponsors`).")

    b.section("2. Cloud Firestore Database Collections")
    b.table(
        ["Collection Name", "What It Stores", "Example Document"],
        [
            ["`profiles`", "User personal info and macro goals.", "{ name: 'Aayush', calorieGoal: 2000, avatar: 'taco' }"],
            ["`scans`", "Raw AI analysis output from Gemini.", "{ scanId: '123', mealName: 'Chicken MoMo', totalKcal: 480 }"],
            ["`meals`", "Meals the user officially tracked.", "{ userId: 'u1', mealName: 'Dal Bhat', savedAt: '2026-11-16' }"],
            ["`mealPlans`", "7-day meal plans and cooldown.", "{ days: [...], generatedAt: '2026-11-16T10:00:00Z' }"]
        ],
        [85, 170, 260]
    )

    b.section("3. Dual-Mode Fallback: Airplane Mode Ready!")
    b.p("In `server/services/inMemoryNutritionStore.js`, if Firebase Cloud credentials are not configured, the app doesn't crash! It automatically falls back to an in-memory database so you can code and test on your laptop anywhere!")

    b.callout("Separation of Concerns", "Keep UI in `client/` and secrets/API keys in `server/`. Never mix them up!", kind="tip")
    b.page_break()

    # =========================================================
    # PAGE 13: CHAPTERS 12 & 13: GIT, NPM & BUGS SOLVED
    # =========================================================
    b.banner(12, "Git, npm & Real Problems Solved", "Your code's time machine, packages, and real bugs solved in KhanaLens")
    
    b.section("1. Git: The Time Machine for Your Code")
    b.bullet("<b>`git status`:</b> Checks which files you have edited.")
    b.bullet("<b>`git add .`:</b> Gathers all your changes into the staging area.")
    b.bullet("<b>`git commit -m \"message\"`:</b> Takes a permanent snapshot of your project so you can always revert if something breaks.")
    b.bullet("<b>`git push origin main`:</b> Uploads your snapshots safely to GitHub.")

    b.section("2. Real Bugs Solved During KhanaLens Development")
    b.table(
        ["Bug / Problem", "What Was Causing It", "The Professional Solution"],
        [
            ["Bottom Nav Covering Content", "Using `position: absolute` inside the scrolling page.", "Moved `BottomNav` to `createPortal(..., document.body)` with `position: fixed`."],
            ["Blurry Partner Banner", "Squeezing tiny text over a 200px board with `crisp-edges`.", "Rebuilt carousel with full-bleed high-res brand banner slides and direct links."],
            ["Camera Black Screen", "Testing over plain HTTP and forcing exact back camera.", "Checked `isSecureContext` and used fallback camera options."],
            ["Upload HTTP 413 Error", "Phones uploading 15MB photos crashing server limits.", "Resized photos on an invisible canvas in `imageCompression.js` before sending."]
        ],
        [110, 160, 245]
    )

    b.callout(
        "Never Use CSS Band-Aids!",
        "When an element looks wrong, don't just add `margin-top: -30px;`! Find the real problem: is it padding? "
        "is it flexbox alignment? Fixing the root cause keeps your app clean across all screen sizes.",
        kind="warn"
    )
    b.page_break()

    # =========================================================
    # PAGE 14: CHAPTER 14: PUTTING KHANALENS ONLINE
    # =========================================================
    b.banner(13, "Putting KhanaLens on the Internet", "Development vs production, Vercel hosting, and keeping secrets safe")
    
    b.section("1. Local Development vs Live Production")
    b.bullet("<b>Local Dev (`npm run dev`):</b> Runs on `localhost:5173`. When you edit code, the screen updates in 50 milliseconds without reloading! Perfect for building.")
    b.bullet("<b>Production (`npm run build`):</b> Squishes all your JSX and CSS into tiny, ultra-fast files ready to be served to millions of users worldwide.")

    b.section("2. How Vercel Hosts Your App (`vercel.json`)")
    b.p("In the root directory, `vercel.json` tells the cloud server how to route traffic:")
    code_vercel = """// vercel.json
{
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/[...path].js" }, /* Sends API calls to backend Express */
    { "src": "/(.*)", "dest": "/client/$1" }              /* Sends page visits to React frontend */
  ]
}"""
    b.code(code_vercel, filename="vercel.json")

    b.section("3. Golden Rules of Cloud Security")
    b.bullet("<b>NEVER commit `.env` files to Git:</b> `.env` holds your Gemini API key and Firebase passwords. It must stay on your computer!")
    b.bullet("<b>Configure Secrets in Cloud Dashboard:</b> When deploying to Vercel, type your API keys in Vercel's Project Settings under 'Environment Variables'.")

    b.callout(
        "Why Vercel is Great for KhanaLens",
        "Vercel serves your React frontend from super-fast CDN servers close to Nepal (in Singapore and Mumbai), "
        "giving your users instant load times!",
        kind="tip"
    )
    b.page_break()

    # =========================================================
    # PAGE 15: CHAPTER 15: YOUR LEARNING ROADMAP
    # =========================================================
    b.banner(14, "Your Simple Learning Roadmap", "The 4-stage beginner plan and 5 fun coding tasks you can do today!")
    
    b.section("1. The 4-Stage Plan to Become an Independent Developer")
    b.table(
        ["Stage", "What to Learn", "Estimated Time", "Mini-Goal"],
        [
            ["Stage 1: HTML & CSS", "Colors, padding, margins, flexbox alignment.", "2 Weeks", "Change colors and card borders in `theme.css`."],
            ["Stage 2: JavaScript", "Variables (`const`/`let`), button clicks, math.", "3 Weeks", "Write a small calorie adder function."],
            ["Stage 3: React Basics", "Components, `useState`, `useEffect`, props.", "3 Weeks", "Add a new button and speech bubble to Doko."],
            ["Stage 4: Backend & APIs", "Express routes, handling uploads, Gemini prompts.", "3 Weeks", "Customize the Gemini AI food prompt."]
        ],
        [85, 175, 75, 180]
    )

    b.section("2. Five Fun Coding Tasks to Try Today in KhanaLens")
    b.bullet("<b>Task 1:</b> Change Doko's greeting in `client/src/components/DokoMascot.jsx` to say your name.")
    b.bullet("<b>Task 2:</b> Change your default daily calorie goal in `client/src/pages/Home.jsx` to 2,200 kcal.")
    b.bullet("<b>Task 3:</b> Change the background cream color in `client/src/styles/theme.css` to a soft light green tint.")
    b.bullet("<b>Task 4:</b> Add a new Nepali partner banner inside `client/src/pages/Home.jsx`.")
    b.bullet("<b>Task 5:</b> Inspect a meal in Chrome DevTools (press F12) to see your real JSON data flowing across the network.")

    b.callout(
        "A Final Message from Your Senior Mentor",
        "Congratulations on completing this handbook! You built an incredible application. Software engineering "
        "is not magic—it is simply small, logical building blocks assembled with care. Open your files, experiment, "
        "break things, and watch them work. You are well on your way to becoming an independent software developer!",
        kind="tip"
    )

def build_15page_pdf(output_path="docs/KhanaLens_Complete_Development_Handbook.pdf"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    styles = get_styles()
    b = SimpleBuilder(styles)
    generate_all_15_pages(b)
    
    print(f"[*] Building 15-page handbook: {output_path}...")
    doc.build(b.story, canvasmaker=NumberedCanvas)
    print(f"[+] Done building {output_path}!")

if __name__ == "__main__":
    build_15page_pdf()
