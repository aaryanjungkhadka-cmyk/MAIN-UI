# builder.py - Helper functions to construct polished ReportLab flowables
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, KeepTogether, PageBreak, Preformatted
from reportlab.lib.colors import HexColor
from .styles import (
    COLOR_PRIMARY, COLOR_DEEP, COLOR_MINT, COLOR_MINT_LIGHT, COLOR_CREAM,
    COLOR_BEIGE, COLOR_BORDER, COLOR_CODE_BG, COLOR_CODE_HEADER,
    COLOR_NOTE_BG, COLOR_NOTE_BORDER, COLOR_TIP_BG, COLOR_TIP_BORDER,
    COLOR_IMPORTANT_BG, COLOR_IMPORTANT_BORDER, COLOR_WARNING_BG, COLOR_WARNING_BORDER,
    escape_xml
)

class DocBuilder:
    def __init__(self, styles):
        self.styles = styles
        self.story = []

    def add(self, flowable):
        if flowable is not None:
            if isinstance(flowable, list):
                self.story.extend(flowable)
            else:
                self.story.append(flowable)

    def page_break(self):
        self.story.append(PageBreak())

    def spacer(self, height=8):
        self.story.append(Spacer(1, height))

    def p(self, text):
        self.story.append(Paragraph(escape_xml(text), self.styles['Body']))

    def p_bold(self, text):
        self.story.append(Paragraph(escape_xml(text), self.styles['BodyBold']))

    def bullet(self, text, prefix="• "):
        self.story.append(Paragraph(f"{prefix}{escape_xml(text)}", self.styles['BulletItem']))

    def chapter_banner(self, number, title, subtitle):
        # Full width stylish chapter banner
        content = [
            Paragraph(f"CHAPTER {number}", self.styles['ChapterNumber']),
            Paragraph(escape_xml(title), self.styles['ChapterTitle']),
            Paragraph(escape_xml(subtitle), self.styles['ChapterSubtitle'])
        ]
        table = Table([[content]], colWidths=[515])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), COLOR_CREAM),
            ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
            ('LINELEFT', (0,0), (-1,-1), 4, COLOR_PRIMARY),
            ('TOPPADDING', (0,0), (-1,-1), 10),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 14),
            ('RIGHTPADDING', (0,0), (-1,-1), 14),
        ]))
        self.story.append(table)
        self.spacer(10)

    def section(self, title):
        # H2 heading with left decorative bar
        t = Table([[Paragraph(escape_xml(title), self.styles['SectionHeading'])]], colWidths=[515])
        t.setStyle(TableStyle([
            ('LINELEFT', (0,0), (-1,-1), 3, COLOR_MINT),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ]))
        self.story.append(t)
        self.spacer(4)

    def subsection(self, title):
        # H3 heading
        self.story.append(Paragraph(escape_xml(title), self.styles['SubSectionHeading']))
        self.spacer(2)

    def callout(self, text, title="KEY TAKEAWAY", kind="note"):
        # Alert box
        bg = COLOR_NOTE_BG
        border = COLOR_NOTE_BORDER
        badge = "ℹ️ NOTE"
        if kind == "tip":
            bg = COLOR_TIP_BG
            border = COLOR_TIP_BORDER
            badge = "💡 SENIOR ARCHITECT TIP"
        elif kind == "important":
            bg = COLOR_IMPORTANT_BG
            border = COLOR_IMPORTANT_BORDER
            badge = "⚠️ IMPORTANT CONCEPT"
        elif kind == "warning" or kind == "mistake":
            bg = COLOR_WARNING_BG
            border = COLOR_WARNING_BORDER
            badge = "🛑 COMMON BEGINNER MISTAKE"

        header_p = Paragraph(f"<b>{badge}: {escape_xml(title)}</b>", self.styles['CalloutTitle'])
        body_p = Paragraph(escape_xml(text), self.styles['CalloutText'])
        
        table = Table([[ [header_p, body_p] ]], colWidths=[515])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg),
            ('BOX', (0,0), (-1,-1), 0.75, border),
            ('LINELEFT', (0,0), (-1,-1), 3.5, border),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ]))
        self.story.append(table)
        self.spacer(6)

    def code_block(self, code_str, filename="", title=""):
        # Professional dark pine code box with line numbers
        lines = code_str.strip().split('\n')
        formatted_lines = []
        for i, line in enumerate(lines, 1):
            line_no = f"{i:2d} | "
            # Escaping happens inside Preformatted or Paragraph
            formatted_lines.append(f"{line_no}{line}")
        
        full_code = '\n'.join(formatted_lines)
        pref = Preformatted(escape_xml(full_code), self.styles['CodeLine'])
        
        header_text = filename if filename else (title if title else "SOURCE CODE")
        header_p = Paragraph(f"<b>📄 {escape_xml(header_text)}</b>", self.styles['CodeFilename'])
        
        table = Table([
            [header_p],
            [pref]
        ], colWidths=[515])
        
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), COLOR_CODE_HEADER),
            ('BACKGROUND', (0,1), (-1,1), COLOR_CODE_BG),
            ('BOX', (0,0), (-1,-1), 1, COLOR_PRIMARY),
            ('LINEBELOW', (0,0), (-1,0), 1, COLOR_MINT),
            ('TOPPADDING', (0,0), (-1,0), 4),
            ('BOTTOMPADDING', (0,0), (-1,0), 4),
            ('LEFTPADDING', (0,0), (-1,0), 8),
            ('RIGHTPADDING', (0,0), (-1,0), 8),
            ('TOPPADDING', (0,1), (-1,1), 6),
            ('BOTTOMPADDING', (0,1), (-1,1), 6),
            ('LEFTPADDING', (0,1), (-1,1), 8),
            ('RIGHTPADDING', (0,1), (-1,1), 8),
        ]))
        
        self.story.append(table)
        self.spacer(6)

    def table(self, headers, rows, col_widths=None):
        if col_widths is None:
            w = 515.0 / len(headers)
            col_widths = [w] * len(headers)
        
        header_cells = [Paragraph(f"<b>{escape_xml(h)}</b>", self.styles['TableHeader']) for h in headers]
        data = [header_cells]
        
        for r_idx, row in enumerate(rows):
            row_cells = []
            for c_idx, cell in enumerate(row):
                if isinstance(cell, str):
                    if cell.startswith('`') and cell.endswith('`'):
                        cell_p = Paragraph(escape_xml(cell.strip('`')), self.styles['TableCellCode'])
                    elif c_idx == 0:
                        cell_p = Paragraph(escape_xml(cell), self.styles['TableCellBold'])
                    else:
                        cell_p = Paragraph(escape_xml(cell), self.styles['TableCell'])
                else:
                    cell_p = cell
                row_cells.append(cell_p)
            data.append(row_cells)
            
        t = Table(data, colWidths=col_widths, repeatRows=1)
        
        t_style = [
            ('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY),
            ('BOX', (0,0), (-1,-1), 0.75, COLOR_BORDER),
            ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 5),
            ('RIGHTPADDING', (0,0), (-1,-1), 5),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]
        
        # Alternate row backgrounds
        for i in range(1, len(data)):
            if i % 2 == 0:
                t_style.append(('BACKGROUND', (0, i), (-1, i), COLOR_BEIGE))
            else:
                t_style.append(('BACKGROUND', (0, i), (-1, i), HexColor('#FFFFFF')))
                
        t.setStyle(TableStyle(t_style))
        self.story.append(t)
        self.spacer(8)

    def diagram_box(self, title, ascii_text):
        pref = Preformatted(escape_xml(ascii_text), self.styles['CodeLine'])
        header_p = Paragraph(f"<b>🏛️ ARCHITECTURE DIAGRAM: {escape_xml(title)}</b>", self.styles['CodeFilename'])
        
        table = Table([
            [header_p],
            [pref]
        ], colWidths=[515])
        
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), COLOR_CREAM),
            ('BACKGROUND', (0,1), (-1,1), HexColor('#FAFCF9')),
            ('BOX', (0,0), (-1,-1), 1, COLOR_PRIMARY),
            ('LINEBELOW', (0,0), (-1,0), 1, COLOR_MINT),
            ('TOPPADDING', (0,0), (-1,0), 4),
            ('BOTTOMPADDING', (0,0), (-1,0), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,1), (-1,1), 6),
            ('BOTTOMPADDING', (0,1), (-1,1), 6),
        ]))
        self.story.append(table)
        self.spacer(8)

    def exercise_box(self, chapter_title, exercises):
        content = [
            Paragraph(f"<b>🎯 PRACTICAL CODING EXERCISES & REFLECTION: {escape_xml(chapter_title)}</b>", self.styles['CalloutTitle']),
            Spacer(1, 3)
        ]
        for i, ex in enumerate(exercises, 1):
            ex_p = Paragraph(f"<b>Exercise {i}:</b> {escape_xml(ex)}", self.styles['CalloutText'])
            content.append(ex_p)
            content.append(Spacer(1, 2))
            
        table = Table([[content]], colWidths=[515])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), COLOR_CREAM),
            ('BOX', (0,0), (-1,-1), 1, COLOR_MINT),
            ('LINELEFT', (0,0), (-1,-1), 4, COLOR_PRIMARY),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ]))
        self.story.append(table)
        self.spacer(10)
