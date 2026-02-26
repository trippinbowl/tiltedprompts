import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-12 w-full border-b border-[#1C1C1A]/20 bg-transparent px-3 py-2 text-sm text-[#1C1C1A] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#1C1C1A]/40 focus-visible:outline-none focus-visible:border-[#C84C31] disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Input.displayName = "Input"

export { Input }
