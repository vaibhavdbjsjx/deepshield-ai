import { useEffect, useState } from "react"
import { getHistory, type HistoryItem } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  useEffect(() => { getHistory().then((res) => setItems(res.items)) }, [])
  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">History</h1>
      <Card><CardHeader><CardTitle>Recent Scans</CardTitle></CardHeader><CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border"><th className="text-left py-2">File</th><th className="text-left py-2">Type</th><th className="text-left py-2">Result</th><th className="text-left py-2">Confidence</th><th className="text-left py-2">Report</th></tr></thead>
          <tbody>
            {items.map((item) => <tr key={item.id} className="border-b border-border/50"><td className="py-2">{item.file_name}</td><td className="py-2 capitalize">{item.type}</td><td className="py-2">{item.prediction}</td><td className="py-2">{(item.confidence * 100).toFixed(1)}%</td><td className="py-2">{item.report_path ? <Button size="sm" variant="outline" onClick={() => window.open(`/api/report?path=${encodeURIComponent(item.report_path || "")}`, "_blank")}>Download</Button> : "-"}</td></tr>)}
          </tbody>
        </table>
      </CardContent></Card>
    </main>
  )
}
