import io
import os
import tempfile

import cv2
import numpy as np
from PIL import Image

from services.image_service import detect_image


def detect_video(video_bytes: bytes, frame_skip: int = 5) -> dict:
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp:
        tmp.write(video_bytes)
        path = tmp.name
    try:
        cap = cv2.VideoCapture(path)
        if not cap.isOpened():
            return {"error": "Could not open video file"}
        total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
        frame_results = []
        for idx in range(0, max(total, 1), max(1, frame_skip)):
            cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
            ok, frame = cap.read()
            if not ok:
                continue
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            buf = io.BytesIO()
            Image.fromarray(rgb).save(buf, format="JPEG")
            result = detect_image(buf.getvalue())
            frame_results.append(
                {
                    "frame_index": idx,
                    "timestamp": round(idx / fps, 2),
                    "prediction": result["prediction"],
                    "confidence": result["confidence"],
                }
            )
            if len(frame_results) >= 40:
                break
        if not frame_results:
            return {"error": "No frames extracted"}
        probs = np.array([r["confidence"] if r["prediction"] == "FAKE" else 1 - r["confidence"] for r in frame_results])
        fake_prob = float(np.clip(probs.mean(), 0.05, 0.95))
        return {
            "prediction": "FAKE" if fake_prob >= 0.5 else "REAL",
            "confidence": round(fake_prob if fake_prob >= 0.5 else 1 - fake_prob, 4),
            "frames_analyzed": len(frame_results),
            "fake_percentage": round(float((probs >= 0.5).mean() * 100), 1),
            "frame_skip": frame_skip,
            "frame_results": frame_results,
        }
    finally:
        try:
            os.unlink(path)
        except OSError:
            pass
