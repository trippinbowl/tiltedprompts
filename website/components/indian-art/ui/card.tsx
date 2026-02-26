import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("bg-[#FAF9F6] border border-[#1C1C1A]/10 shadow-sm relative overflow-hidden group", className)} {...props} >
        {/* Subtle hover effect line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#C84C31] to-[#E28743] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {props.children}
    </div>
))
Card.displayName = "Card"

export { Card }
