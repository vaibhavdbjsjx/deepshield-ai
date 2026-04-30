import { createContext, useContext, useMemo, useState } from "react"

type ToastType = "success" | "error" | "loading" | "info"
type ToastItem = { id: number; message: string; type: ToastType }
const Ctx = createContext<{ toast: (m: string, t: ToastType) => number; dismiss: (id: number) => void }>({
  toast: () => 0,
  dismiss: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const value = useMemo(
    () => ({
      toast: (message: string, type: ToastType) => {
        const id = Date.now() + Math.random()
        setItems((prev) => [...prev, { id, message, type }])
        if (type !== "loading") setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 3500)
        return id
      },
      dismiss: (id: number) => setItems((prev) => prev.filter((x) => x.id !== id)),
    }),
    []
  )
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="glass-card rounded-xl px-4 py-3 text-sm">
            {item.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useToast() {
  return useContext(Ctx)
}
