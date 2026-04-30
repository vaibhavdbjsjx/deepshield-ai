import { Link } from "react-router-dom"
import { BadgeCheck, BarChart3, Brain, ChevronRight, Eye, Fingerprint, Globe, Image, Lock, Mic, Radar, Repeat2, ScanSearch, Shield, UserCheck, Video, Webcam, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  { icon: Image, title: "Image Detection", description: "Upload images and analyze manipulation signatures.", path: "/image", cta: "Try Image Detection" },
  { icon: Video, title: "Video Detection", description: "Frame-level timeline analysis for suspicious moments.", path: "/video", cta: "Try Video Detection" },
  { icon: Mic, title: "Audio Detection", description: "Voice deepfake screening with spectrogram review.", path: "/audio", cta: "Try Audio Detection" },
  { icon: Webcam, title: "Live Detection", description: "Stabilized webcam detection with uncertainty handling.", path: "/live", cta: "Start Live Detection" },
]
const stats = [
  { icon: Zap, label: "Real-time Analysis", value: "<1s" },
  { icon: Eye, label: "Multi-modal AI", value: "4 Modes" },
  { icon: Lock, label: "Privacy First", value: "Local" },
  { icon: BarChart3, label: "Explainable AI", value: "Grad-CAM" },
]
const modules = [
  { icon: Fingerprint, title: "Deepfake Fingerprint Tracking", desc: "Detects model-specific generation traces.", status: "Active" },
  { icon: ScanSearch, title: "AI Pattern Signature Detection", desc: "Finds GAN and diffusion artifact signatures.", status: "Active" },
  { icon: Radar, title: "Phase Consistency Analyzer", desc: "Checks frequency and phase mismatch anomalies.", status: "Experimental" },
  { icon: Globe, title: "Viral Fake Tracker", desc: "Tracks spread risk and source propagation.", status: "Experimental" },
  { icon: Repeat2, title: "Deepfake Replay Simulator", desc: "Replays suspicious regions for forensics.", status: "Experimental" },
  { icon: UserCheck, title: "Original Face Matching", desc: "Compares identity consistency with references.", status: "Active" },
  { icon: BadgeCheck, title: "Authenticity Certificate", desc: "Generates signed authenticity summaries.", status: "Active" },
  { icon: Brain, title: "Behavioral Anomaly Detection", desc: "Flags unnatural facial and motion behavior.", status: "Experimental" },
]

export function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero-deepshield.png"
            alt="DeepShield cyber shield visualization"
            className="w-full h-full object-cover opacity-80 scale-105 animate-[pulse_8s_ease-in-out_infinite]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-background/50 to-background/88" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/35 shadow-[0_0_30px_hsl(217_91%_60%/0.24)]">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Protection</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">Detect Deepfakes <span className="gradient-text">In Real Time</span></h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">DeepShield AI uses advanced neural networks to detect manipulated images, videos, audio, and live streams.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/image"><Button variant="glow" size="xl">Get Started<ChevronRight className="ml-2 h-5 w-5" /></Button></Link>
              <Link to="/share"><Button variant="outline" size="xl">Share App</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 md:py-14">
        <Card className="border-primary/20">
          <CardContent className="p-6 md:p-8">
            <div className="mb-4">
              <h2 className="text-2xl md:text-3xl font-bold">Advanced Intelligence Modules</h2>
              <p className="text-muted-foreground mt-2">AI-powered forensic tools for deepfake analysis and authenticity verification</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {modules.map((module) => (
                <div key={module.title} className="rounded-2xl border border-transparent bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-transparent p-[1px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_hsl(230_90%_65%/0.25)]">
                  <div className="h-full rounded-2xl border border-white/10 bg-card/65 backdrop-blur-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center"><module.icon className="h-5 w-5 text-primary" /></div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${module.status === "Active" ? "text-success border-success/40 bg-success/10" : "text-amber-300 border-amber-400/40 bg-amber-500/10"}`}>{module.status}</span>
                    </div>
                    <h3 className="font-bold text-sm mb-1">{module.title}</h3>
                    <p className="text-xs text-muted-foreground">{module.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="glass-card-hover">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><stat.icon className="h-6 w-6 text-primary" /></div>
                <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-sm text-muted-foreground">{stat.label}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Detection Capabilities</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Choose your detection mode based on your needs. All powered by the same advanced AI engine.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="glass-card-hover">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6"><feature.icon className="h-7 w-7 text-primary" /></div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-8 flex-1">{feature.description}</p>
                <Link to={feature.path}><Button variant="outline" className="w-full">{feature.cta}<ChevronRight className="ml-2 h-4 w-4" /></Button></Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <Card className="overflow-hidden border-primary/25">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Forensic Visual Intelligence</h2>
              <p className="text-muted-foreground">
                Advanced cross-signal analysis across face, texture, artifact, and temporal consistency helps surface believable deepfake evidence.
              </p>
            </div>
            <div className="relative min-h-[260px]">
              <img
                src="/feature-scan-ai.png"
                alt="Neural forensic feature scan"
                className="absolute inset-0 w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-card/60 to-transparent" />
            </div>
          </div>
        </Card>
      </section>
    </main>
  )
}
