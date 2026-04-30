import base64
import io

import cv2
import numpy as np
from PIL import Image

from services.image_service import detect_image


def explain_image(image_bytes: bytes) -> dict:
    result = detect_image(image_bytes)
    original = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    arr = np.array(original)
    gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
    heat = cv2.GaussianBlur(gray, (31, 31), 0)
    heat = cv2.normalize(heat, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_detector.detectMultiScale(gray, 1.1, 4)
    if len(faces) > 0:
        x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
        mask = np.zeros_like(heat)
        mask[y : y + h, x : x + w] = 255
        heat = cv2.bitwise_and(heat, mask)
        heat = cv2.GaussianBlur(heat, (25, 25), 0)
    colored = cv2.applyColorMap(heat, cv2.COLORMAP_JET)
    colored = cv2.cvtColor(colored, cv2.COLOR_BGR2RGB)
    overlay = cv2.addWeighted(arr, 0.58, colored, 0.42, 0)
    out_heat = io.BytesIO()
    out_overlay = io.BytesIO()
    Image.fromarray(colored).save(out_heat, format="PNG")
    Image.fromarray(overlay).save(out_overlay, format="PNG")
    result.update(
        {
            "heatmap": base64.b64encode(out_heat.getvalue()).decode(),
            "overlay": base64.b64encode(out_overlay.getvalue()).decode(),
        }
    )
    return result
