import { useEffect, useState } from "react"
import { getSettings, saveSettings, type AppSettings } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  useEffect(() => { getSettings().then(setSettings) }, [])
  if (!settings) return <main className="container mx-auto px-4 py-12">Loading settings...</main>
  const update = async (patch: Partial<AppSettings>) => setSettings(await saveSettings(patch))
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Card><CardHeader><CardTitle>Detection Preferences</CardTitle></CardHeader><CardContent className="space-y-5">
        <label className="flex items-center justify-between"><span>Show heatmap explanation</span><input type="checkbox" checked={settings.show_heatmap} onChange={(e) => update({ show_heatmap: e.target.checked })} /></label>
        <label className="flex items-center justify-between"><span>Enable audio detection</span><input type="checkbox" checked={settings.audio_detection} onChange={(e) => update({ audio_detection: e.target.checked })} /></label>
        <label className="space-y-2 block"><span className="block">Sensitivity: {settings.sensitivity.toFixed(2)}</span><input className="w-full" type="range" min={0.1} max={0.9} step={0.05} value={settings.sensitivity} onChange={(e) => update({ sensitivity: Number(e.target.value) })} /></label>
      </CardContent></Card>
    </main>
  )
}
