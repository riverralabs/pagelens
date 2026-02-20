"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  placeholder?: string
}

const SelectContext = React.createContext<{ value: string; setValue: (v: string) => void; open: boolean; setOpen: (v: boolean) => void }>({ value: "", setValue: () => {}, open: false, setOpen: () => {} })

function Select({ value: controlledValue, onValueChange, children, placeholder }: SelectProps) {
  const [internalValue, setInternalValue] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const value = controlledValue !== undefined ? controlledValue : internalValue
  const setValue = (v: string) => {
    setInternalValue(v)
    onValueChange?.(v)
    setOpen(false)
  }
  return <SelectContext.Provider value={{ value, setValue, open, setOpen }}><div className="relative">{children}</div></SelectContext.Provider>
}

function SelectTrigger({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = React.useContext(SelectContext)
  return (
    <button
      type="button"
      className={cn("flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className)}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext)
  return <span className={!value ? "text-muted-foreground" : ""}>{value || placeholder}</span>
}

function SelectContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = React.useContext(SelectContext)
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open, setOpen])
  if (!open) return null
  return (
    <div ref={ref} className={cn("absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md", className)} {...props}>
      <div className="p-1">{children}</div>
    </div>
  )
}

function SelectItem({ value, children, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const ctx = React.useContext(SelectContext)
  return (
    <div
      className={cn("relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground", ctx.value === value && "bg-accent", className)}
      onClick={() => ctx.setValue(value)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
