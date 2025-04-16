import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { VirtualizerHandle } from "virtua"

import { cn } from "../../lib/utils"
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { VirtualizedVirtualizer } from "../../components/ui/virtualization"

interface Option {
	value: string;
	label: string;
}

interface VirtualizedSelectProps {
	placeholder?: string;
	value?: string;
	className?: string; // Class for SelectTrigger
	onValueChange?: (value: string) => void;
	options: Option[];
}

const VirtualizedSelect: any = ({
	placeholder,
	value,
	className,
	onValueChange,
	options
}: VirtualizedSelectProps) => {
  const [open, setOpen] = React.useState(false)

  const virtualizerRef = React.useRef<VirtualizerHandle>(null)
  const viewportRef = React.useRef<HTMLDivElement>(null)

  const activeIndex = React.useMemo(
    () => options.findIndex((option) => option.value === value),
    [value]
  )

  React.useLayoutEffect(() => {
    if (!open || !value || activeIndex === -1) return

    setTimeout(() => {
      // Recover scroll position.
      virtualizerRef.current?.scrollToIndex(activeIndex, { align: "end" })

      const checkedElement = viewportRef.current?.querySelector(
        "[data-state=checked]"
      ) as HTMLElement

      // Recover focus.
      checkedElement?.focus({ preventScroll: true })
    })
  }, [open, value, activeIndex])

  return (
    <Select
      open={open}
      onOpenChange={setOpen}
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className={cn(
            "relative z-50 max-h-96 min-w-[11rem] overflow-hidden text-ellipsis rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
          )}
          position="popper"
        >
          <SelectPrimitive.Viewport
            ref={viewportRef}
            className={cn(
              "p-1",
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
            )}
          >
            <VirtualizedVirtualizer
              ref={virtualizerRef}
              keepMounted={activeIndex !== -1 ? [activeIndex] : undefined}
              overscan={2}
            >
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
					<div className='flex items-center justify-start'>
						<span> {option.label}</span>
					</div>
                </SelectItem>
              ))}
            </VirtualizedVirtualizer>
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </Select>
  )
}
export { VirtualizedSelect };