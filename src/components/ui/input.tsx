import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-none border-4 border-black bg-white px-4 py-2 text-base font-bold transition-all outline-none placeholder:text-gray-400 placeholder:font-black placeholder:uppercase focus-visible:shadow-bold disabled:pointer-events-none disabled:opacity-50 md:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
