import { Link, useLocation } from "react-router-dom"
import { Menu, Shield, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", path: "/" },
  { label: "Image Detection", path: "/image" },
  { label: "Video Detection", path: "/video" },
  { label: "Audio Detection", path: "/audio" },
  { label: "Live Detection", path: "/live" },
  { label: "Analytics", path: "/analytics" },
  { label: "History", path: "/history" },
  { label: "Settings", path: "/settings" },
  { label: "Profile", path: "/profile" },
  { label: "Share", path: "/share" },
]

export function Header() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold gradient-text">DeepShield AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 rounded-xl border border-border/60 bg-card/40 px-1 py-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={cn("px-3 py-2 rounded-lg text-xs lg:text-sm", pathname === item.path ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent")}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button className="md:hidden p-2" onClick={() => setOpen((v) => !v)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border/50 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="block px-4 py-2 rounded-lg" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
