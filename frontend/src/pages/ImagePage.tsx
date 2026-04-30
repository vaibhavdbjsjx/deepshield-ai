import { useEffect, useState } from "react"
import { Eye, EyeOff, RotateCcw, ScanLine } from "lucide-react"
import { FileUpload } from "@/components/FileUpload"
import { ResultCard } from "@/components/ResultCard"
import { Spinner } from "@/components/Spinner"
import { useToast } from "@/components/Toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { detectImage, explainImage, getSettings, type DetectionResult } from "@/lib/api"

export function ImagePage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [explainLoading, setExplainLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [explainData, setExplainData] = useState<DetectionResult | null>(null)
  const { toast, dismiss } = useToast()

  useEffect(() => { getSettings().then((s) => setShowHeatmap(Boolean(s.show_heatmap))).catch(() => null) }, [])

  const handleDetect = async () => {
    if (!file) return
    const id = toast("Analyzing image...", "loading")
    setLoading(true)
    try {
      const res = await detectImage(file)
      setResult(res)
      setError(null)
      dismiss(id)
    } catch {
      dismiss(id)
      setError("Detection failed. Please ensure the backend server is running.")
    } finally {
      setLoading(false)
    }
  }

  const handleExplain = async () => {
    if (!file) return
    setExplainLoading(true)
    try {
      const res = await explainImage(file)
      setExplainData(res)
      setShowHeatmap(true)
    } finally {
      setExplainLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="space-y-2 mb-10"><h1 className="text-3xl font-bold">Image Detection</h1><p className="text-muted-foreground">Upload an image to analyze it for deepfake manipulation with AI-powered explainability.</p></div>
      {!preview ? (
        <FileUpload accept="image/*" onFile={(f) => { setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); setExplainData(null); setError(null) }} label="Upload an image for analysis" icon="image" />
      ) : (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>{showHeatmap && explainData ? "Heatmap Overlay" : "Original Image"}</CardTitle>
                  {explainData && <Button variant="ghost" size="sm" onClick={() => setShowHeatmap((v) => !v)}>{showHeatmap ? <><EyeOff className="mr-1.5 h-4 w-4" />Original</> : <><Eye className="mr-1.5 h-4 w-4" />Heatmap</>}</Button>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative rounded-lg overflow-hidden bg-muted">
                  <img src={showHeatmap && explainData?.overlay ? `data:image/png;base64,${explainData.overlay}` : preview} alt="preview" className="w-full h-auto max-h-[400px] object-contain" />
                  {loading && <div className="absolute inset-0 bg-background/60 flex items-center justify-center"><Spinner label="Analyzing..." /></div>}
                </div>
              </CardContent>
            </Card>
            {showHeatmap && explainData?.heatmap ? (
              <Card>
                <CardHeader className="pb-3"><CardTitle>Raw Heatmap</CardTitle></CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden bg-muted"><img src={`data:image/png;base64,${explainData.heatmap}`} alt="heatmap" className="w-full h-auto max-h-[400px] object-contain" /></div>
                  <p className="text-xs text-muted-foreground mt-3">Highlighted areas show regions influencing AI decision</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex gap-3">
                  <Button variant="glow" size="lg" onClick={handleDetect} disabled={loading} className="flex-1"><ScanLine className="mr-2 h-5 w-5" />{loading ? "Analyzing..." : "Detect Deepfake"}</Button>
                  <Button variant="outline" size="lg" onClick={() => { setFile(null); setPreview(null); setResult(null); setExplainData(null); setError(null) }}><RotateCcw className="h-5 w-5" /></Button>
                </div>
                {result && <Button variant="outline" size="lg" onClick={handleExplain} disabled={explainLoading}>{explainLoading ? "Generating Heatmap..." : "Show AI Explanation"}</Button>}
                {error && <Card><CardContent className="p-4"><p className="text-sm text-danger">{error}</p></CardContent></Card>}
                {result && <ResultCard prediction={result.prediction} confidence={result.confidence} trustScore={result.trust_score} />}
                {result && (
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <Button variant="ghost" className="w-full justify-between" onClick={() => setShowDetails((v) => !v)}>View Detailed Analysis <span>{showDetails ? "▲" : "▼"}</span></Button>
                      {showDetails && <div className="space-y-3">
                        <p className="text-sm font-semibold">{result.details_title}</p>
                        <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">{(result.reasons || []).map((reason) => <li key={reason}>{reason}</li>)}</ul>
                        {result.no_face && <p className="text-sm text-amber-300">No face detected. Upload a clearer face photo for better analysis.</p>}
                        {result.breakdown && ([
                          ["Face Analysis", result.breakdown.face],
                          ["Texture Analysis", result.breakdown.texture],
                          ["Artifact Detection", result.breakdown.artifact],
                        ] as const).map(([label, value]) => (
                          <div key={label}>
                            <div className="flex justify-between text-xs mb-1"><span>{label}</span><span>{value}%</span></div>
                            <div className="h-2 bg-muted rounded"><div className="h-2 bg-primary rounded" style={{ width: `${value}%` }} /></div>
                          </div>
                        ))}
                        <div className="text-xs text-muted-foreground border-t border-border/60 pt-2"><p>{result.model_info}</p><p>{result.disclaimer}</p></div>
                      </div>}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
