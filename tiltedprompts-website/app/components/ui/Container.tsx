import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}

export default function Container({ children, className, wide = false }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-6 md:px-8",
        wide ? "max-w-[1440px]" : "max-w-[1200px]",
        className
      )}
    >
      {children}
    </div>
  );
}
