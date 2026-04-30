import axios from "axios"

// SAFE + WORKING BASE URL
const API_BASE =
  (import.meta as any).env?.VITE_API_URL || "/"

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000
})

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