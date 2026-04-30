import json
import os

PATH = os.path.join(os.path.dirname(__file__), "..", "settings.json")
DEFAULTS = {"show_heatmap": True, "audio_detection": True, "sensitivity": 0.5}


def get_settings():
    if not os.path.exists(PATH):
        return DEFAULTS.copy()
    with open(PATH, "r") as f:
        data = json.load(f)
    out = DEFAULTS.copy()
    out.update(data)
    return out


def update_settings(new_settings):
    current = get_settings()
    current.update(new_settings)
    with open(PATH, "w") as f:
        json.dump(current, f, indent=2)
    return current
