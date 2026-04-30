import json
import os
import time
import uuid
from threading import Lock

STORE = os.path.join(os.path.dirname(__file__), "..", "analytics_data.json")
_lock = Lock()


def _load():
    if os.path.exists(STORE):
        with open(STORE, "r") as f:
            return json.load(f)
    return {"scans": [], "totals": {"image": 0, "video": 0, "audio": 0, "live": 0}}


def _save(data):
    with open(STORE, "w") as f:
        json.dump(data, f, indent=2)


def record_scan(scan_type, prediction, confidence, file_name="", report_path=""):
    with _lock:
        data = _load()
        data["scans"].append(
            {
                "id": uuid.uuid4().hex,
                "type": scan_type,
                "file_name": file_name or "scan",
                "prediction": prediction,
                "confidence": confidence,
                "timestamp": time.time(),
                "report_path": report_path,
            }
        )
        data["scans"] = data["scans"][-200:]
        data["totals"][scan_type] = data["totals"].get(scan_type, 0) + 1
        _save(data)


def get_analytics():
    data = _load()
    scans = data["scans"]
    return {
        "total_scans": sum(data["totals"].values()),
        "totals_by_type": data["totals"],
        "fake_count": sum(1 for s in scans if s["prediction"] == "FAKE"),
        "real_count": sum(1 for s in scans if s["prediction"] == "REAL"),
        "avg_confidence": round(sum(s["confidence"] for s in scans) / len(scans), 4) if scans else 0.0,
        "recent_scans": sorted(scans, key=lambda s: s["timestamp"], reverse=True)[:20],
    }


def get_history(limit=100):
    return sorted(_load()["scans"], key=lambda s: s["timestamp"], reverse=True)[:limit]
