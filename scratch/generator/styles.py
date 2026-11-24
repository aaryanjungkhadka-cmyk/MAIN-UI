# styles.py - Color palette, typography, and canvas management for KhanaLens Handbook
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas
import xml.sax.saxutils as saxutils

# ---------------------------------------------------------
# KhanaLens Brand Color Palette
# ---------------------------------------------------------
COLOR_PRIMARY = HexColor('#1F4D33')        # Dark Forest Green (Brand Text & Primary UI)
COLOR_DEEP = HexColor('#163D29')           # Deeper Forest Green
COLOR_MINT = HexColor('#3FA47A')           # Active Mint Green Accent (#76C4AE / #3FA47A)
COLOR_MINT_LIGHT = HexColor('#E8F5EE')     # Soft Mint Background Tint
COLOR_CREAM = HexColor('#FBF7EE')          # Warm Cream Background
COLOR_BEIGE = HexColor('#F7F1E4')          # Soft Beige Card Tint
COLOR_TEXT = HexColor('#1F2937')           # Dark Slate Text (Charcoal)
COLOR_MUTED = HexColor('#4B5563')          # Muted Gray Text
COLOR_BORDER = HexColor('#D1E2D8')         # Clean Table & Card Border

# Code & Container Colors
COLOR_CODE_BG = HexColor('#141E18')        # Deep Pine Code Block Background
COLOR_CODE_HEADER = HexColor('#1D2E24')    # Slightly lighter code header
COLOR_CODE_TEXT = HexColor('#E2E8F0')      # Off-white Code Syntax Text
COLOR_CODE_LINE = HexColor('#52796F')      # Line Number Color

# Alert Box Colors
COLOR_NOTE_BG = HexColor('#F0FDF4')        # Light Green
COLOR_NOTE_BORDER = HexColor('#3FA47A')    # Mint
COLOR_TIP_BG = HexColor('#EFF6FF')         # Light Blue
COLOR_TIP_BORDER = HexColor('#3B82F6')     # Blue
COLOR_IMPORTANT_BG = HexColor('#FFFBEB')    # Light Amber
COLOR_IMPORTANT_BORDER = HexColor('#F59E0B')# Amber
COLOR_WARNING_BG = HexColor('#FEF2F2')      # Light Red
COLOR_WARNING_BORDER = HexColor('#EF4444')  # Red

def escape_xml(text):
    if not text:
        return ""
    return saxutils.escape(str(text))

# ---------------------------------------------------------
# Dynamic Two-Pass NumberedCanvas for Accurate Page Totals
# ---------------------------------------------------------
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
                self.drawString(40, 805, "KHANALENS – COMPLETE PROJECT KNOWLEDGE TRANSFER & ARCHITECTURE HANDBOOK")
                self.setFont('Helvetica-Oblique', 8)
                self.setFillColor(COLOR_MUTED)
                self.drawRightString(555, 805, "Architecture & Engineering Guide")
                
                # Header divider rule
                self.setStrokeColor(COLOR_BORDER)
                self.setLineWidth(0.75)
                self.line(40, 797, 555, 797)
                
                # Footer divider rule
                self.line(40, 45, 555, 45)
                
                # Running Footer
                self.setFont('Helvetica', 8)
                self.setFillColor(COLOR_MUTED)
                self.drawString(40, 32, "KhanaLens Nutrition App • Monorepo Engineering • Antigravity AI")
                self.setFont('Helvetica-Bold', 8)
                self.setFillColor(COLOR_PRIMARY)
                self.drawRightString(555, 32, f"Page {self._pageNumber} of {num_pages}")
                
                self.restoreState()
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

# ---------------------------------------------------------
# Typography Stylesheet
# ---------------------------------------------------------
def get_handbook_styles():
    base_styles = getSampleStyleSheet()
    styles = {}

    styles['CoverTitle'] = ParagraphStyle(
        'CoverTitle',
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=29,
        textColor=COLOR_PRIMARY,
        alignment=0, # Left
        spaceAfter=10
    )

    styles['CoverSubtitle'] = ParagraphStyle(
        'CoverSubtitle',
        fontName='Helvetica',
        fontSize=12.5,
        leading=17,
        textColor=COLOR_MUTED,
        alignment=0,
        spaceAfter=15
    )

    styles['ChapterNumber'] = ParagraphStyle(
        'ChapterNumber',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=COLOR_MINT,
        textTransform='uppercase',
        spaceAfter=4
    )

    styles['ChapterTitle'] = ParagraphStyle(
        'ChapterTitle',
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=COLOR_PRIMARY,
        spaceAfter=6
    )

    styles['ChapterSubtitle'] = ParagraphStyle(
        'ChapterSubtitle',
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=13.5,
        textColor=COLOR_MUTED,
        spaceAfter=12
    )

    styles['SectionHeading'] = ParagraphStyle(
        'SectionHeading',
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=16,
        textColor=COLOR_PRIMARY,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    styles['SubSectionHeading'] = ParagraphStyle(
        'SubSectionHeading',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13.5,
        textColor=COLOR_DEEP,
        spaceBefore=9,
        spaceAfter=4,
        keepWithNext=True
    )

    styles['Body'] = ParagraphStyle(
        'Body',
        fontName='Helvetica',
        fontSize=8.8,
        leading=12.2,
        textColor=COLOR_TEXT,
        spaceAfter=5
    )

    styles['BodyBold'] = ParagraphStyle(
        'BodyBold',
        fontName='Helvetica-Bold',
        fontSize=8.8,
        leading=12.2,
        textColor=COLOR_TEXT,
        spaceAfter=5
    )

    styles['BulletItem'] = ParagraphStyle(
        'BulletItem',
        fontName='Helvetica',
        fontSize=8.8,
        leading=12.2,
        textColor=COLOR_TEXT,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3
    )

    styles['CalloutTitle'] = ParagraphStyle(
        'CalloutTitle',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=COLOR_PRIMARY,
        spaceAfter=3
    )

    styles['CalloutText'] = ParagraphStyle(
        'CalloutText',
        fontName='Helvetica',
        fontSize=8.3,
        leading=11.5,
        textColor=COLOR_TEXT
    )

    styles['CodeFilename'] = ParagraphStyle(
        'CodeFilename',
        fontName='Courier-Bold',
        fontSize=8,
        leading=10,
        textColor=COLOR_MINT
    )

    styles['CodeLine'] = ParagraphStyle(
        'CodeLine',
        fontName='Courier',
        fontSize=7.2,
        leading=9.2,
        textColor=COLOR_CODE_TEXT
    )

    styles['TableHeader'] = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=HexColor('#FFFFFF')
    )

    styles['TableCell'] = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.2,
        textColor=COLOR_TEXT
    )

    styles['TableCellBold'] = ParagraphStyle(
        'TableCellBold',
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10.2,
        textColor=COLOR_TEXT
    )

    styles['TableCellCode'] = ParagraphStyle(
        'TableCellCode',
        fontName='Courier',
        fontSize=7.2,
        leading=9.2,
        textColor=COLOR_DEEP
    )

    return styles
