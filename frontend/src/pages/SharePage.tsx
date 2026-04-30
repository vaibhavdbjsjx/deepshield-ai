import { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { getShareInfo, type ShareInfo } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SharePage() {
  const [info, setInfo] = useState<ShareInfo | null>(null)
  useEffect(() => { getShareInfo().then(setInfo).catch(() => null) }, [])
  const url = info?.public_url || info?.local_url || ""
  const cameraWarning = url.startsWith("http://") && !url.includes("localhost")
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Share</h1>
      <Card><CardHeader><CardTitle>Public Access Link Ready</CardTitle></CardHeader><CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Open this link on mobile to test</p>
        <a href={url} target="_blank" rel="noreferrer" className="text-primary underline break-all">{url}</a>
        <Button variant="outline" onClick={() => navigator.clipboard.writeText(url)}>Copy Link</Button>
        {url && <div className="inline-block rounded-lg bg-white p-3"><QRCodeSVG value={url} size={180} /></div>}
        {cameraWarning && <p className="text-amber-300 text-sm">Camera may not work on HTTP mobile links. Prefer HTTPS public URL.</p>}
        {!info?.public_url && <p className="text-sm text-muted-foreground">{info?.fallback_message}</p>}
      </CardContent></Card>
    </main>
  )
}
