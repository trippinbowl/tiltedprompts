import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "default", ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
                {
                    "bg-[#C84C31] text-[#FAF9F6] hover:bg-[#A33D27] shadow-[2px_2px_0px_0px_#1C1C1A] hover:shadow-[1px_1px_0px_0px_#1C1C1A] hover:translate-x-[1px] hover:translate-y-[1px] rounded-tr-md rounded-bl-md font-serif italic": variant === "default",
                    "border border-[#E28743] text-[#1C1C1A] hover:bg-[#E28743]/10": variant === "outline",
                    "text-[#1C1C1A] hover:bg-[#1C1C1A]/5": variant === "ghost",
                },
                className
            )}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button }
