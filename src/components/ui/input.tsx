import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        className={cn(
          "h-12 w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-base font-medium text-slate-900 shadow-xs transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus-visible:border-slate-400 focus-visible:ring-4 focus-visible:ring-slate-100 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50 aria-invalid:border-rose-400 aria-invalid:ring-4 aria-invalid:ring-rose-100",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
