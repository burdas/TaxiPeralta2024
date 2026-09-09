import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  size?: number | "default" | "sm"
}) {
  const esAnchoNumerico = typeof size === "number"
  const sizeClasses = esAnchoNumerico
    ? "h-9 px-3 py-1 text-base md:text-sm"
    : size === "sm"
      ? "h-8 px-2.5 text-sm"
      : "h-9 px-3 py-1 text-base md:text-sm"

  return (
    <input
      type={type}
      data-slot="input"
      size={esAnchoNumerico ? size : undefined}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses,
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
