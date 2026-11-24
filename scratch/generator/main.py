# main.py - Assemble all modules and build the COMPLETE_PROJECT_KNOWLEDGE_TRANSFER PDF handbook
import os
import sys
import shutil

# Ensure generator package can import its sibling modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate

from generator.styles import get_handbook_styles, NumberedCanvas
from generator.builder import DocBuilder
from generator.cover_and_audit import build_cover_and_audit
from generator.chapters_1_to_3 import build_chapters_1_to_3
from generator.chapters_4_to_7 import build_chapters_4_to_7
from generator.chapters_8_features import build_chapters_8_features
from generator.chapters_9_to_11 import build_chapters_9_to_11
from generator.chapters_12_to_15 import build_chapters_12_to_15
from generator.chapters_16_solutions import build_chapters_16_solutions
from generator.chapters_17_roadmap import build_chapters_17_roadmap
from generator.glossary import build_glossary

def generate_handbook(output_path="COMPLETE_PROJECT_KNOWLEDGE_TRANSFER.pdf"):
    # Target directory handling
    dir_name = os.path.dirname(output_path)
    if dir_name:
        os.makedirs(dir_name, exist_ok=True)
    
    print(f"[*] Initializing Document Template for {output_path}...")
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=50
    )
    
    styles = get_handbook_styles()
    b = DocBuilder(styles)
    
    print("[*] Assembling Cover Page, Codebase Audit & Table of Contents...")
    build_cover_and_audit(b)
    
    print("[*] Assembling Chapters 1, 2, and 3 (Foundations & Architecture)...")
    build_chapters_1_to_3(b)
    
    print("[*] Assembling Chapters 4, 5, 6, and 7 (Frontend, CSS, JS & React)...")
    build_chapters_4_to_7(b)
    
    print("[*] Assembling Chapter 8: KhanaLens 16 Core Features Deep Dive...")
    build_chapters_8_features(b)
    
    print("[*] Assembling Chapters 9, 10, and 11 (Animations, Clean Code & Backend/DB)...")
    build_chapters_9_to_11(b)
    
    print("[*] Assembling Chapters 12, 13, 14, and 15 (Git, Debugging, Deployment & Roadmap)...")
    build_chapters_12_to_15(b)
    
    print("[*] Assembling Chapter 16: Practical Coding Exercises with Complete Step-by-Step Solutions...")
    build_chapters_16_solutions(b)
    
    print("[*] Assembling Chapter 17: Known Technical Issues, Incomplete Features & Strategic Roadmap...")
    build_chapters_17_roadmap(b)
    
    print("[*] Assembling Comprehensive Technical Glossary...")
    build_glossary(b)
    
    print(f"[*] Building PDF with Two-Pass NumberedCanvas ({len(b.story)} flowables)...")
    doc.build(b.story, canvasmaker=NumberedCanvas)
    
    file_size_kb = os.path.getsize(output_path) / 1024
    print(f"[+] SUCCESS! Generated: {output_path} ({file_size_kb:.1f} KB)")

    # Also keep a copy in docs/
    docs_copy = os.path.join("docs", "COMPLETE_PROJECT_KNOWLEDGE_TRANSFER.pdf")
    os.makedirs("docs", exist_ok=True)
    shutil.copyfile(output_path, docs_copy)
    print(f"[+] Created mirror copy at: {docs_copy}")

if __name__ == "__main__":
    generate_handbook()
