import { useRef } from "react"
import { Image as ImageIcon, Video } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function FileUpload({
  accept,
  onFile,
  label,
  icon = "image",
  className = "",
}: {
  accept: string
  onFile: (file: File) => void
  label: string
  icon?: "image" | "video"
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const Icon = icon === "video" ? Video : ImageIcon
  return (
    <Card className={className}>
      <CardContent className="p-10 text-center">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
        <button className="w-full flex flex-col items-center gap-4" onClick={() => inputRef.current?.click()}>
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold">{label}</p>
            <p className="text-sm text-muted-foreground">Click to browse files</p>
          </div>
        </button>
      </CardContent>
    </Card>
  )
}
