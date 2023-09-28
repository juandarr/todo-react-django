'use client';

import * as React from 'react';
import { Calendar as CalendarIconSax } from 'iconsax-react';

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

import { type DatePickerProps } from '../../lib/customTypes';

export function DatePickerWithPresets({
	newTodo,
	setNewTodo,
}: DatePickerProps): React.JSX.Element {
	// const [date, setDate] = React.useState<Date>();
	if (newTodo.dueDate !== undefined) {
		console.log('Current date: ', newTodo.dueDate);
	}
	// console.log('New date: ', newTodo.dueDate?.toUTCString());

	return (
		<Popover modal={true}>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-[240px] justify-start text-left font-normal',
						newTodo.dueDate === undefined && 'text-muted-foreground',
					)}>
					<CalendarIconSax className='mr-2 h-6 w-6' />
					{newTodo.dueDate !== undefined ? (
						format(newTodo.dueDate as Date, 'E, MMM do')
					) : (
						<span>Due date</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align='start'
				className='flex w-auto flex-col space-y-2 p-2'>
				<Select
					onValueChange={(value) => {
						setNewTodo((old) => ({
							...old,
							dueDate: addDays(new Date(), parseInt(value)),
						}));
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
					<Calendar
						mode='single'
						selected={newTodo.dueDate as Date}
						onSelect={(date) => {
							setNewTodo((old) => ({
								...old,
								dueDate: date,
							}));
						}}
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}
