import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "glow" | "danger" | "secondary"
  size?: "default" | "sm" | "lg" | "xl" | "icon"
}

export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all disabled:opacity-50",
        variant === "default" && "bg-primary text-black hover:opacity-90",
        variant === "outline" && "border border-border bg-card/50 hover:bg-card",
        variant === "ghost" && "hover:bg-card/50",
        variant === "glow" && "bg-primary text-black shadow-[0_0_28px_hsl(217_91%_60%/0.25)] hover:scale-[1.01]",
        variant === "danger" && "bg-danger text-white",
        variant === "secondary" && "bg-secondary text-foreground",
        size === "default" && "px-4 py-2",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "lg" && "px-5 py-3",
        size === "xl" && "px-6 py-3.5",
        size === "icon" && "h-10 w-10",
        className
      )}
      {...props}
    />
  )
}
