'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '../../lib/utils';
// 1. Create a Context to hold the hover/touch state
const HoverStateContext = React.createContext<boolean>(false);

// 2. The Provider component detects the interaction mode and provides it to the context
const OriginalTooltipProvider = TooltipPrimitive.Provider;

const TooltipProvider = (
	props: React.ComponentProps<typeof OriginalTooltipProvider>
) => {
	const [isHoverDisabled, setIsHoverDisabled] = React.useState(false);

	React.useEffect(() => {
		// This function checks for the 'noHover' class on the body
		const checkNoHover = () => {
			const hasNoHover = document.body.classList.contains('noHover');
			// Update state only if it has changed to prevent unnecessary re-renders
			setIsHoverDisabled((prev) => (prev !== hasNoHover ? hasNoHover : prev));
		};

		checkNoHover(); // Initial check

		// Use a MutationObserver to watch for class changes on the body element
		const observer = new MutationObserver(checkNoHover);
		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => observer.disconnect();
	}, []);

	// This component now wraps the original Radix provider AND our new context provider
	return (
		<HoverStateContext.Provider value={isHoverDisabled}>
			<OriginalTooltipProvider {...props} />
		</HoverStateContext.Provider>
	);
};

// 3. The Tooltip component consumes the context to disable itself
const OriginalTooltip = TooltipPrimitive.Root;

const Tooltip = (props: React.ComponentProps<typeof OriginalTooltip>) => {
	const isHoverDisabled = React.useContext(HoverStateContext);

	// If hover is disabled (touch interaction), we render the tooltip
	// but force it to be closed by controlling its `open` state.
	if (isHoverDisabled) {
		return <OriginalTooltip {...props} open={false} />;
	}

	// Otherwise, render the tooltip as a normal (uncontrolled) component
	return <OriginalTooltip {...props} />;
};

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<TooltipPrimitive.Content
		ref={ref}
		sideOffset={sideOffset}
		className={cn(
			'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			className
		)}
		{...props}
	/>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
