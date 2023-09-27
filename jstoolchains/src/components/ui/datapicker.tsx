'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, format } from 'date-fns';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './select';

export function DatePickerWithPresets(): React.JSX.Element {
	const [date, setDate] = React.useState<Date>();

	return (
		<Popover modal={true}>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-[240px] justify-start text-left font-normal',
						date === undefined && 'text-muted-foreground',
					)}>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{date !== undefined ? format(date, 'PPP') : <span>Due date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align='start'
				className='flex w-auto flex-col space-y-2 p-2'>
				<Select
					onValueChange={(value) => {
						setDate(addDays(new Date(), parseInt(value)));
					}}>
					<SelectTrigger>
						<SelectValue placeholder='Select' />
					</SelectTrigger>
					<SelectContent position='popper'>
						<SelectItem value='0'>Today</SelectItem>
						<SelectItem value='1'>Tomorrow</SelectItem>
						<SelectItem value='3'>In 3 days</SelectItem>
						<SelectItem value='7'>In a week</SelectItem>
					</SelectContent>
				</Select>
				<div className='rounded-md border'>
					<Calendar mode='single' selected={date} onSelect={setDate} />
				</div>
			</PopoverContent>
		</Popover>
	);
}
