import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all",
  {
    variants: {
      variant: {
        default: "bg-black text-white",
        secondary:
          "bg-yellow-300 text-black",
        destructive:
          "bg-red-500 text-white",
        outline:
          "bg-white text-black border-2 border-black",
        ghost:
          "bg-transparent text-black border-transparent",
        link: "text-blue-600 underline shadow-none border-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
