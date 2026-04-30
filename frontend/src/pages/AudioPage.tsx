import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { detectAudio, type AudioDetectionResult } from "@/lib/api"

export function AudioPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<AudioDetectionResult | null>(null)
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="space-y-2 mb-10"><h1 className="text-3xl font-bold">Audio Detection</h1><p className="text-muted-foreground">Spectrogram-based audio authenticity screening.</p></div>
      <Card><CardContent className="p-6 space-y-4">
        <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        {file && <audio controls className="w-full" src={URL.createObjectURL(file)} />}
        <Button variant="glow" onClick={async () => file && setResult(await detectAudio(file))}>Analyze Audio</Button>
        {result && <div className="grid md:grid-cols-2 gap-4">
          <Card><CardHeader><CardTitle>Waveform</CardTitle></CardHeader><CardContent><img src={`data:image/png;base64,${result.waveform}`} className="w-full rounded-xl" /></CardContent></Card>
          <Card><CardHeader><CardTitle>Spectrogram</CardTitle></CardHeader><CardContent><img src={`data:image/png;base64,${result.spectrogram}`} className="w-full rounded-xl" /></CardContent></Card>
        </div>}
      </CardContent></Card>
    </main>
  )
}
