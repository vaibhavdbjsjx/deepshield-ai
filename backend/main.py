from typing import Optional

import uvicorn
from fastapi import BackgroundTasks, FastAPI, File, Header, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from services.analytics_store import get_analytics, get_history, record_scan
from services.audio_service import detect_audio
from services.auth_store import get_user_from_token, login_user, register_user
from services.explain_service import explain_image
from services.fusion_service import compute_fusion
from services.image_service import detect_image
from services.live_service import detect_live_frame
from services.model import MODEL_METRICS
from services.report_service import generate_report
from services.settings_store import get_settings, update_settings
from services.share_service import get_share_info, init_share_info
from services.video_service import detect_video

app = FastAPI(title="DeepShield AI Backend", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

MAX_IMAGE_SIZE = 20 * 1024 * 1024
MAX_VIDEO_SIZE = 100 * 1024 * 1024
MAX_AUDIO_SIZE = 50 * 1024 * 1024


class AuthIn(BaseModel):
    email: str
    password: str
    name: Optional[str] = None


class SettingsIn(BaseModel):
    show_heatmap: Optional[bool] = None
    audio_detection: Optional[bool] = None
    sensitivity: Optional[float] = None


def _validate(content: bytes, max_size: int):
    if not content:
        raise HTTPException(status_code=400, detail="Empty file uploaded")
    if len(content) > max_size:
        raise HTTPException(status_code=413, detail="File too large")


@app.on_event("startup")
async def on_startup():
    init_share_info()


@app.get("/health")
async def health():
    share = get_share_info()
    return {"status": "running", "version": "2.0.0", "public_url": share["public_url"], "local_url": share["local_url"]}


@app.post("/detect/image")
async def api_detect_image(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    try:
        content = await file.read()
        _validate(content, MAX_IMAGE_SIZE)
        result = detect_image(content)
        report = generate_report(file.filename or "image", result["prediction"], result["confidence"], "image")
        if background_tasks:
            background_tasks.add_task(record_scan, "image", result["prediction"], result["confidence"], file.filename or "image", report)
        return result
    except HTTPException:
        raise
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/detect/video")
async def api_detect_video(file: UploadFile = File(...), frame_skip: int = Query(default=5, ge=1, le=30)):
    try:
        content = await file.read()
        _validate(content, MAX_VIDEO_SIZE)
        result = detect_video(content, frame_skip=frame_skip)
        if "error" not in result:
            record_scan("video", result["prediction"], result["confidence"], file.filename or "video", "")
        return result
    except HTTPException:
        raise
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/detect/audio")
async def api_detect_audio(file: UploadFile = File(...)):
    try:
        content = await file.read()
        _validate(content, MAX_AUDIO_SIZE)
        result = detect_audio(content, file.filename or "audio.wav")
        if "error" not in result:
            record_scan("audio", result["prediction"], result["confidence"], file.filename or "audio.wav", "")
        return result
    except HTTPException:
        raise
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/detect/live")
async def api_detect_live(file: UploadFile = File(...)):
    try:
        content = await file.read()
        result = detect_live_frame(content)
        record_scan("live", result["prediction"], result["confidence"], file.filename or "live-frame", "")
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/explain/image")
async def api_explain_image(file: UploadFile = File(...)):
    try:
        content = await file.read()
        _validate(content, MAX_IMAGE_SIZE)
        return explain_image(content)
    except HTTPException:
        raise
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/explain/video")
async def api_explain_video(file: UploadFile = File(...)):
    result = await api_detect_video(file, frame_skip=10)
    if isinstance(result, JSONResponse):
        return result
    frames = result.get("frame_results", [])[:3]
    return {"summary": result, "explained_frames": frames}


@app.post("/api/fusion")
async def api_fusion(image: UploadFile = File(None), audio: UploadFile = File(None)):
    face_pred = face_conf = voice_pred = voice_conf = None
    if image:
        img = await image.read()
        if img:
            img_result = detect_image(img)
            face_pred, face_conf = img_result["prediction"], img_result["confidence"]
    if audio:
        aud = await audio.read()
        if aud:
            aud_result = detect_audio(aud, audio.filename or "audio.wav")
            voice_pred, voice_conf = aud_result["prediction"], aud_result["confidence"]
    return compute_fusion(face_pred, face_conf, voice_pred, voice_conf)


@app.get("/api/analytics")
async def api_analytics():
    return get_analytics()


@app.get("/api/history")
async def api_history(limit: int = Query(default=100, ge=1, le=500)):
    return {"items": get_history(limit)}


@app.get("/api/report")
async def api_report(path: str):
    return FileResponse(path, media_type="application/pdf", filename=path.split("/")[-1])


@app.get("/api/metrics")
async def api_metrics():
    return MODEL_METRICS


@app.get("/api/settings")
async def api_settings():
    return get_settings()


@app.post("/api/settings")
async def api_update_settings(body: SettingsIn):
    return update_settings(body.dict(exclude_none=True))


@app.get("/api/share")
async def api_share():
    return get_share_info()


@app.post("/auth/register")
async def api_register(body: AuthIn):
    if not body.name:
        raise HTTPException(status_code=400, detail="Name is required")
    result = register_user(body.email, body.password, body.name)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@app.post("/auth/login")
async def api_login(body: AuthIn):
    result = login_user(body.email, body.password)
    if "error" in result:
        raise HTTPException(status_code=401, detail=result["error"])
    return result


@app.get("/auth/profile")
async def api_profile(authorization: str = Header(default="")):
    user = get_user_from_token(authorization.replace("Bearer ", ""))
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
