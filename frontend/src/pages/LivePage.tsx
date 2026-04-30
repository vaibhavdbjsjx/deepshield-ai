import { useCallback, useEffect, useRef, useState } from "react"
import { AlertTriangle, RotateCcw, Video, VideoOff } from "lucide-react"
import { detectLiveFrame, type DetectionResult } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function LivePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const frameCounterRef = useRef(0)
  const [active, setActive] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const captureAndSend = useCallback(async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    frameCounterRef.current += 1
    if (frameCounterRef.current % 5 !== 0 || !video || !canvas || video.readyState < 2) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8))
    if (!blob) return
    try {
      const res = await detectLiveFrame(blob)
      setResult(res)
      setError(null)
    } catch {
      setError("Detection failed")
    }
  }, [])

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: "user" } })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setActive(true)
      intervalRef.current = setInterval(captureAndSend, 250)
    } catch {
      setCameraError("Could not access camera. Please allow camera permissions.")
    }
  }, [captureAndSend])

  const stopCamera = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    setActive(false)
    setResult(null)
    setError(null)
  }, [])

  useEffect(() => () => stopCamera(), [stopCamera])

  const isReal = result?.prediction === "REAL"
  const isUncertain = result?.prediction === "UNCERTAIN"
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-2 mb-10"><h1 className="text-3xl font-bold">Live Detection</h1><p className="text-muted-foreground">Real-time deepfake detection using your webcam feed.</p></div>
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0 relative">
            <div className="relative bg-muted aspect-video flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline muted className={cn("w-full h-full object-cover", !active && "hidden")} />
              <canvas ref={canvasRef} className="hidden" />
              {!active && <div className="flex flex-col items-center gap-4 p-12"><div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center"><Video className="h-10 w-10 text-primary" /></div><p className="text-muted-foreground text-center">Click the button below to start your webcam and begin real-time detection.</p></div>}
              {active && result && <div className={cn("absolute top-4 right-4 rounded-xl px-5 py-3 backdrop-blur-md border", isUncertain ? "bg-amber-500/10 border-amber-300/40" : isReal ? "bg-success/10 border-success/40" : "bg-danger/10 border-danger/40")}><div className="text-right"><p className={cn("text-lg font-bold", isUncertain ? "text-amber-300" : isReal ? "result-real" : "result-fake")}>{result.prediction}</p><p className="text-xs text-muted-foreground">{(result.confidence * 100).toFixed(1)}% confidence</p>{result.stabilizing && <p className="text-[10px] text-primary">Stabilizing detection...</p>}{result.no_face && <p className="text-[10px] text-amber-300">No face detected</p>}</div></div>}
              {active && <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-danger/20 border border-danger/40"><div className="h-2 w-2 rounded-full bg-danger animate-pulse" /><span className="text-xs font-medium text-danger">LIVE</span></div>}
              {active && error && <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-danger/10 border border-danger/30 px-4 py-2"><p className="text-xs text-danger">{error}</p></div>}
            </div>
          </CardContent>
        </Card>
        {cameraError && <Card className="border-danger/30"><CardContent className="p-4 flex items-center justify-between gap-3"><p className="text-sm text-danger">{cameraError}</p><Button variant="outline" size="sm" onClick={startCamera}><RotateCcw className="mr-1 h-4 w-4" />Retry</Button></CardContent></Card>}
        <div className="flex justify-center">{!active ? <Button variant="glow" size="xl" onClick={startCamera}><Video className="mr-2 h-5 w-5" />Start Camera</Button> : <Button variant="danger" size="xl" onClick={stopCamera}><VideoOff className="mr-2 h-5 w-5" />Stop Camera</Button>}</div>
        <Card><CardContent className="p-4 text-sm text-muted-foreground flex items-start gap-2"><AlertTriangle className="h-4 w-4 mt-0.5 text-amber-300" />This system provides probabilistic analysis, not absolute verification.</CardContent></Card>
      </div>
    </main>
  )
}
