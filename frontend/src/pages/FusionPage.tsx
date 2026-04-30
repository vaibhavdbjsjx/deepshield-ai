import { useState } from "react"
import { runFusion, type FusionResult } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FusionPage() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [result, setResult] = useState<FusionResult | null>(null)
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-2 mb-10"><h1 className="text-3xl font-bold">Fusion Analysis</h1><p className="text-muted-foreground">Combine face and voice evidence into a single risk assessment.</p></div>
      <Card><CardContent className="p-6 space-y-4">
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
        <Button variant="glow" onClick={async () => setResult(await runFusion(imageFile, audioFile))}>Run Fusion</Button>
        {result && <Card><CardHeader><CardTitle>{result.risk_level}</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{result.explanation}</p></CardContent></Card>}
      </CardContent></Card>
    </main>
  )
}
