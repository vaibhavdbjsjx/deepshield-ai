import { useEffect, useState } from "react"
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js"
import { Bar, Pie } from "react-chartjs-2"
import { getAnalytics, getMetrics, type AnalyticsData, type ModelMetrics } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null)
  useEffect(() => { getAnalytics().then(setData); getMetrics().then(setMetrics) }, [])
  if (!data) return <main className="container mx-auto px-4 py-12">Loading analytics...</main>
  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card><CardContent className="p-5"><p className="text-xl font-bold">{data.total_scans}</p><p className="text-xs text-muted-foreground">Total Scans</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xl font-bold">{data.real_count}</p><p className="text-xs text-muted-foreground">Real</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xl font-bold">{data.fake_count}</p><p className="text-xs text-muted-foreground">Fake</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xl font-bold">{(data.avg_confidence * 100).toFixed(1)}%</p><p className="text-xs text-muted-foreground">Avg Confidence</p></CardContent></Card>
      </div>
      {metrics && <Card className="mb-8"><CardHeader><CardTitle>Model Metrics</CardTitle></CardHeader><CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"><div>Accuracy: {(metrics.accuracy * 100).toFixed(1)}%</div><div>Precision: {(metrics.precision * 100).toFixed(1)}%</div><div>Recall: {(metrics.recall * 100).toFixed(1)}%</div><div>{metrics.model_name}</div></CardContent></Card>}
      <div className="grid md:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Fake vs Real</CardTitle></CardHeader><CardContent><Pie data={{ labels: ["Real", "Fake"], datasets: [{ data: [data.real_count, data.fake_count], backgroundColor: ["#22c55e", "#ef4444"] }] }} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Scans by Type</CardTitle></CardHeader><CardContent><Bar data={{ labels: Object.keys(data.totals_by_type), datasets: [{ label: "Scans", data: Object.values(data.totals_by_type), backgroundColor: "#3b82f6" }] }} /></CardContent></Card>
      </div>
    </main>
  )
}
