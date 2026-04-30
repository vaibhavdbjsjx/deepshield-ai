import { ShieldAlert, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function ResultCard({
  prediction,
  confidence,
  trustScore,
  className,
}: {
  prediction: "FAKE" | "REAL" | "UNCERTAIN"
  confidence: number
  trustScore?: number
  className?: string
}) {
  const isReal = prediction === "REAL"
  const isUncertain = prediction === "UNCERTAIN"
  const score = typeof trustScore === "number" ? trustScore : Math.round(isReal ? confidence * 100 : (1 - confidence) * 100)
  const ringColor = score >= 70 ? "text-success" : score >= 40 ? "text-amber-300" : "text-danger"
  return (
    <Card className={cn(className, isReal ? "border-success/30" : "border-danger/20")}>
      <CardContent className="p-8 flex flex-col items-center gap-4">
        <div className={cn("h-20 w-20 rounded-full flex items-center justify-center", isUncertain ? "bg-amber-500/10 text-amber-300" : isReal ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
          {isReal ? <ShieldCheck className="h-10 w-10" /> : <ShieldAlert className="h-10 w-10" />}
        </div>
        <div className="text-center">
          <p className={cn("text-4xl font-bold", isUncertain ? "text-amber-300" : isReal ? "result-real" : "result-fake")}>{prediction}</p>
          <p className="text-sm text-muted-foreground">{(confidence * 100).toFixed(1)}% confidence</p>
        </div>
        <div className="relative h-28 w-28">
          <svg className="h-28 w-28 -rotate-90">
            <circle cx="56" cy="56" r="48" stroke="currentColor" strokeOpacity="0.15" strokeWidth="10" fill="none" className="text-muted-foreground" />
            <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="none" strokeDasharray={`${2 * Math.PI * 48}`} strokeDashoffset={`${2 * Math.PI * 48 * (1 - score / 100)}`} className={ringColor} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold">{score}</span>
            <span className="text-[10px] text-muted-foreground">Trust Score</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
