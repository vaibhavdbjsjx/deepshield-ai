import { useState } from "react"
import { getProfile, login, register } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProfilePage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [profile, setProfile] = useState<{ email: string; name: string } | null>(null)

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <Card><CardHeader><CardTitle>User Auth</CardTitle></CardHeader><CardContent className="space-y-3">
        <input className="w-full bg-card p-2 rounded-md" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full bg-card p-2 rounded-md" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full bg-card p-2 rounded-md" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex gap-2">
          <Button onClick={async () => register(email, password, name)}>Register</Button>
          <Button variant="outline" onClick={async () => { const res = await login(email, password); localStorage.setItem("token", res.access_token) }}>Login</Button>
          <Button variant="secondary" onClick={async () => { const token = localStorage.getItem("token") || ""; if (token) setProfile(await getProfile(token)) }}>Load Profile</Button>
        </div>
        {profile && <p className="text-sm text-muted-foreground">{profile.name} ({profile.email})</p>}
      </CardContent></Card>
    </main>
  )
}
