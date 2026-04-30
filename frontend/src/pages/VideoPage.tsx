import { useState } from "react"
import { FileUpload } from "@/components/FileUpload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { detectVideo, type VideoDetectionResult } from "@/lib/api"
import { ResultCard } from "@/components/ResultCard"

export function VideoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<VideoDetectionResult | null>(null)
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="space-y-2 mb-10"><h1 className="text-3xl font-bold">Video Detection</h1><p className="text-muted-foreground">Frame-by-frame temporal analysis with smoothed aggregation.</p></div>
      {!preview ? <FileUpload accept="video/*" onFile={(f) => { setFile(f); setPreview(URL.createObjectURL(f)) }} label="Upload a video for analysis" icon="video" /> : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card><CardContent className="p-4"><video src={preview} controls className="w-full rounded-xl" /></CardContent></Card>
          <div className="space-y-4">
            <Button variant="glow" onClick={async () => file && setResult(await detectVideo(file))}>Analyze Video</Button>
            {result && <ResultCard prediction={result.prediction} confidence={result.confidence} />}
            {result && <Card><CardHeader><CardTitle>Timeline Summary</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Frames analyzed: {result.frames_analyzed}</p><p className="text-sm text-muted-foreground">Fake percentage: {result.fake_percentage}%</p></CardContent></Card>}
          </div>
        </div>
      )}
    </main>
  )
}
