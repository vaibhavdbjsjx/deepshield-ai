from collections import deque
import io

import cv2
import numpy as np
from PIL import Image

from services.image_service import detect_image

_history = deque(maxlen=10)
_face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


def detect_live_frame(frame_bytes: bytes) -> dict:
    arr = np.frombuffer(frame_bytes, dtype=np.uint8)
    frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if frame is None:
        return {"prediction": "UNCERTAIN", "confidence": 0.0, "stabilizing": True, "message": "Invalid frame", "no_face": True}
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = _face_detector.detectMultiScale(gray, 1.1, 5, minSize=(80, 80))
    if len(faces) == 0:
        return {"prediction": "UNCERTAIN", "confidence": 0.0, "stabilizing": len(_history) < 10, "message": "No face detected", "no_face": True}
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    face = cv2.cvtColor(frame[y : y + h, x : x + w], cv2.COLOR_BGR2RGB)
    buf = io.BytesIO()
    Image.fromarray(face).save(buf, format="JPEG", quality=90)
    raw = detect_image(buf.getvalue())
    if raw["prediction"] == "FAKE":
        fake_prob = raw["confidence"]
    elif raw["prediction"] == "REAL":
        fake_prob = 1 - raw["confidence"]
    else:
        fake_prob = 0.5
    _history.append(float(fake_prob))
    avg = float(np.mean(_history))
    if avg >= 0.65:
        prediction, confidence = "FAKE", avg
    elif avg <= 0.35:
        prediction, confidence = "REAL", 1 - avg
    else:
        prediction, confidence = "UNCERTAIN", max(avg, 1 - avg)
    return {
        "prediction": prediction,
        "confidence": round(confidence, 4),
        "stabilizing": len(_history) < 10,
        "message": "Stabilizing detection..." if len(_history) < 10 else "",
        "no_face": False,
    }
