import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react"
import { ToastProvider } from "@/components/Toast"
import { Header } from "@/components/Header"
import { getShareInfo, type ShareInfo } from "@/lib/api"
import { HomePage } from "@/pages/HomePage"
import { ImagePage } from "@/pages/ImagePage"
import { VideoPage } from "@/pages/VideoPage"
import { AudioPage } from "@/pages/AudioPage"
import { LivePage } from "@/pages/LivePage"
import { FusionPage } from "@/pages/FusionPage"
import { AnalyticsPage } from "@/pages/AnalyticsPage"
import { HistoryPage } from "@/pages/HistoryPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { ProfilePage } from "@/pages/ProfilePage"
import { SharePage } from "@/pages/SharePage"

function App() {
  const [shareInfo, setShareInfo] = useState<ShareInfo | null>(null)
  useEffect(() => { getShareInfo().then(setShareInfo).catch(() => null) }, [])
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="app-shell min-h-screen text-foreground">
          <div className="animated-bg"><div className="animated-grid" /></div>
          <Header />
          {shareInfo && (
            <div className="mx-auto max-w-6xl px-4 pt-4">
              <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm flex flex-wrap items-center gap-2">
                <span>🌐 Public Access Link Ready</span>
                <a className="text-primary underline break-all" href={shareInfo.public_url || shareInfo.local_url} target="_blank" rel="noreferrer">
                  {shareInfo.public_url || shareInfo.local_url}
                </a>
                <button className="ml-auto text-xs border border-border px-2 py-1 rounded" onClick={() => navigator.clipboard.writeText(shareInfo.public_url || shareInfo.local_url)}>Copy Link</button>
              </div>
            </div>
          )}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/image" element={<ImagePage />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/audio" element={<AudioPage />} />
            <Route path="/live" element={<LivePage />} />
            <Route path="/fusion" element={<FusionPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/share" element={<SharePage />} />
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
