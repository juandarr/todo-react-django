'use client';

import * as React from 'react';
import { useRef } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { useVirtualizer } from '@tanstack/react-virtual';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './select'; // Assuming './select' is the correct path to your Shadcn select components
import { cn } from '../../lib/utils'; // Assuming this path is correct

interface Option {
	value: string;
	label: string;
}

interface VirtualizedSelectProps {
	options: Option[];
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	height?: number; // Optional: Height of the dropdown viewport in pixels
	itemHeight?: number; // Optional: Estimated height of each item in pixels
	className?: string; // Allow passing additional classes to SelectTrigger
	contentClassName?: string; // Allow passing additional classes to SelectContent
}

const VirtualizedSelect = ({
	placeholder,
	value,
	className,
	onValueChange,
	options,
	height = 200, // Default dropdown height
	itemHeight = 35, // Default estimated item height
	
	contentClassName,
}: VirtualizedSelectProps) => {
	const parentRef = useRef(null);

	const virtualizer = useVirtualizer({
		count: options.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => itemHeight,
		overscan: 5,
	});

	const virtualItems = virtualizer.getVirtualItems();
	console.log(options);
	const totalSize = virtualizer.getTotalSize();
	console.log(virtualItems, totalSize);
	// Find the label for the currently selected value to display in the trigger
	const selectedOptionLabel = options.find(
		(option) => option.value === value,
	)?.label;

	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger className={className}>
				{/* Display selected label or placeholder */}
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent
				className={contentClassName}
				style={{ height: `${height}px`,overflow: 'auto' }}>
					{/* Removed Spacer div */}
					{/* Absolutely positioned virtual items as direct children of Viewport */}
					{options.map((option) => {
						//const option = options[virtualItem.index];
						console.log('Option: ', option);
						if (!option) {
							return null; // Should ideally not happen if count is correct
						}
						
						return (
								<SelectItem value={option.value} key={option.value}>
									{option.label}
								</SelectItem>
							);
						})}
					{/* End of mapping */}
			</SelectContent>
		</Select>
	);
};

export { VirtualizedSelect };
