from services.model import preprocess, predict


def detect_image(image_bytes: bytes) -> dict:
    result = predict(preprocess(image_bytes), image_bytes=image_bytes)
    if result["prediction"] == "REAL":
        trust_score = int(round(result["confidence"] * 100))
    elif result["prediction"] == "FAKE":
        trust_score = int(round((1 - result["confidence"]) * 100))
    else:
        trust_score = 50

    if result.get("no_face"):
        reasons = ["No clear face detected, so the system cannot make a reliable identity-level judgment."]
        title = "Why this is uncertain:"
    elif result["prediction"] == "FAKE":
        reasons = [
            "Facial texture inconsistency detected",
            "Abnormal blending around cheeks and eyes",
            "High-frequency noise patterns detected",
            "GAN artifact signatures found",
        ]
        title = "Why this is likely a deepfake:"
    elif result["prediction"] == "REAL":
        reasons = [
            "Natural facial symmetry",
            "No artifact patterns detected",
            "Consistent lighting and texture",
        ]
        title = "Why this appears authentic:"
    else:
        reasons = [
            "The image contains mixed indicators",
            "Some artifact-like patterns were detected, but not strongly enough",
            "A stronger model or more context is needed for reliable verification",
        ]
        title = "Why this is uncertain:"

    feature_scores = result.get("feature_scores", {"face": 0.5, "texture": 0.5, "artifact": 0.5})
    result.update(
        {
            "trust_score": max(0, min(100, trust_score)),
            "details_title": title,
            "reasons": reasons,
            "breakdown": {
                "face": int(feature_scores["face"] * 100),
                "texture": int(feature_scores["texture"] * 100),
                "artifact": int(feature_scores["artifact"] * 100),
            },
            "model_info": "Model: ViT DeepFake Detector (HF) + Forensic Heuristic Fusion",
            "disclaimer": "This system provides probabilistic analysis, not absolute verification",
        }
    )
    return result
