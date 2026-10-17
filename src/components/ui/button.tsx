import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent font-bold text-sm whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-4 focus-visible:ring-slate-200/80 active:scale-95 disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        primary:
          "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-xs",
        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200/90 border border-slate-200/70",
        ghost:
          "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70",
        destructive:
          "bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 hover:shadow-lg hover:-translate-y-0.5",
        link:
          "text-blue-600 underline-offset-4 hover:underline p-0 h-auto font-semibold active:scale-100",
      },
      size: {
        default: "h-11 gap-2 px-5 text-sm font-bold rounded-xl",
        sm: "h-9 gap-1.5 px-3.5 text-xs font-bold rounded-lg",
        lg: "h-12 gap-2.5 px-7 text-base font-extrabold rounded-2xl",
        xl: "h-14 gap-3 px-8 text-base sm:text-lg font-black rounded-2xl",
        icon: "size-11 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
