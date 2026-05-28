import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-none border-4 border-black bg-white px-4 py-3 text-base font-bold transition-all outline-none placeholder:text-gray-400 placeholder:font-black placeholder:uppercase focus-visible:shadow-bold disabled:pointer-events-none disabled:opacity-50 md:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
