import axios from "axios"

// safe env (avoids TS error)
const API_BASE =
  (import.meta as any).env?.VITE_API_URL || "/"

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000
})

/* ================= TYPES ================= */

export interface DetectionResult {
  prediction: "FAKE" | "REAL" | "UNCERTAIN"
  confidence: number
  trust_score?: number
  details_title?: string
  reasons?: string[]
  breakdown?: { face: number; texture: number; artifact: number }
  model_info?: string
  disclaimer?: string
  stabilizing?: boolean
  message?: string
  no_face?: boolean
  heatmap?: string
  overlay?: string
}

export interface VideoDetectionResult extends DetectionResult {
  frames_analyzed: number
  fake_percentage: number
  frame_results: {
    frame_index: number
    timestamp: number
    prediction: "FAKE" | "REAL"
    confidence: number
  }[]
}

export interface AudioDetectionResult extends DetectionResult {
  spectrogram: string
  waveform: string
  duration: number
  sample_rate: number
}

export interface AnalyticsData {
  total_scans: number
  totals_by_type: Record<string, number>
  fake_count: number
  real_count: number
  avg_confidence: number
  recent_scans?: {
    type: string
    prediction: string
    confidence: number
    timestamp: number
  }[]
}

export interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  model_name: string
  input_size?: string
}

export interface AppSettings {
  show_heatmap: boolean
  audio_detection: boolean
  sensitivity: number
}

export interface HistoryItem {
  id: string
  type: string
  file_name: string
  prediction: string
  confidence: number
  timestamp: number
  report_path?: string
}

export interface ShareInfo {
  local_url: string
  public_url: string
  fallback_message?: string
  https_ready?: boolean
}

export interface FusionResult {
  risk_level: string
  explanation: string
  modalities?: {
    face?: { prediction: string; confidence: number } | null
    voice?: { prediction: string; confidence: number } | null
  }
}

/* ================= API ================= */

export async function detectImage(file: File) {
  const form = new FormData()
  form.append("file", file)
  return (await api.post<DetectionResult>("/detect/image", form)).data
}

export async function detectVideo(file: File) {
  const form = new FormData()
  form.append("file", file)
  return (await api.post<VideoDetectionResult>("/detect/video", form)).data
}

export async function detectAudio(file: File) {
  const form = new FormData()
  form.append("file", file)
  return (await api.post<AudioDetectionResult>("/detect/audio", form)).data
}

export async function detectLiveFrame(blob: Blob) {
  const form = new FormData()
  form.append("file", blob, "frame.jpg")
  return (await api.post<DetectionResult>("/detect/live", form)).data
}

export async function explainImage(file: File) {
  const form = new FormData()
  form.append("file", file)
  return (await api.post<DetectionResult>("/explain/image", form)).data
}

export async function runFusion(
  imageFile: File | null,
  audioFile: File | null
) {
  const form = new FormData()
  if (imageFile) form.append("image", imageFile)
  if (audioFile) form.append("audio", audioFile)
  return (await api.post<FusionResult>("/api/fusion", form)).data
}

export async function getAnalytics() {
  return (await api.get<AnalyticsData>("/api/analytics")).data
}

export async function getMetrics() {
  return (await api.get<ModelMetrics>("/api/metrics")).data
}

export async function getHistory() {
  return (await api.get<{ items: HistoryItem[] }>("/api/history")).data
}

export async function getSettings() {
  return (await api.get<AppSettings>("/api/settings")).data
}

export async function saveSettings(payload: Partial<AppSettings>) {
  return (await api.post<AppSettings>("/api/settings", payload)).data
}

export async function getShareInfo() {
  return (await api.get<ShareInfo>("/api/share")).data
}

export async function register(
  email: string,
  password: string,
  name: string
) {
  await api.post("/auth/register", { email, password, name })
}

export async function login(email: string, password: string) {
  return (
    await api.post<{ access_token: string; token_type: string }>(
      "/auth/login",
      { email, password }
    )
  ).data
}

export async function getProfile(token: string) {
  return (
    await api.get<{ email: string; name: string }>(
      "/auth/profile",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
  ).data
}