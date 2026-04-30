import os
import time

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

REPORTS = os.path.join(os.path.dirname(__file__), "..", "reports")
os.makedirs(REPORTS, exist_ok=True)


def generate_report(file_name, prediction, confidence, scan_type):
    out = os.path.join(REPORTS, f"report_{scan_type}_{int(time.time())}.pdf")
    c = canvas.Canvas(out, pagesize=A4)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, 800, "DeepShield AI Detection Report")
    c.setFont("Helvetica", 12)
    c.drawString(50, 760, f"File: {file_name}")
    c.drawString(50, 740, f"Type: {scan_type}")
    c.drawString(50, 720, f"Prediction: {prediction}")
    c.drawString(50, 700, f"Confidence: {round(confidence * 100, 2)}%")
    c.save()
    return out
