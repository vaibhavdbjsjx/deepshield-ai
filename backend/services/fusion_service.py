def compute_fusion(face_prediction, face_confidence, voice_prediction, voice_confidence):
    if face_prediction == "FAKE" and voice_prediction == "FAKE":
        risk_level = "HIGH RISK"
        explanation = "Both face and audio analysis indicate likely manipulation."
    elif face_prediction == "REAL" and voice_prediction == "REAL":
        risk_level = "LOW RISK"
        explanation = "Both face and audio analysis appear authentic."
    elif face_prediction or voice_prediction:
        risk_level = "UNCERTAIN"
        explanation = "Modalities disagree or only one modality is available."
    else:
        risk_level = "UNKNOWN"
        explanation = "No analysis available."
    return {
        "risk_level": risk_level,
        "explanation": explanation,
        "modalities": {
            "face": {"prediction": face_prediction, "confidence": face_confidence} if face_prediction else None,
            "voice": {"prediction": voice_prediction, "confidence": voice_confidence} if voice_prediction else None,
        },
    }
