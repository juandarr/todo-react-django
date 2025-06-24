'use client';

import * as React from 'react';

import {
	Calendar1 as Today,
	SunFog as Tomorrow,
	ArrowRight3 as In3Days,
	Forward as InAWeek,
	Calendar as CalendarIcon,
	CalendarRemove as NoDate,
	Clock
} from 'iconsax-reactjs';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from './tooltip';

import { addDays, format, setHours, setMinutes } from 'date-fns';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

import { type DatePickerProps } from '../../lib/customTypes';
import { Checkbox } from '../ui/checkbox';

export function DateTimePickerWithPresets({
	newTodo,
	setNewTodo,
	isDisabled
}: DatePickerProps): React.JSX.Element {
	const [isOpen, setIsOpen] = React.useState(false);
	// If dueDate exists, take it from current dueDate value, otherwise default to 12AM
	const [timeInput, setTimeInput] = React.useState<string>(
		newTodo.dueDate ? format(newTodo.dueDate as Date, 'HH:mm') : '00:00'
	);

	const openPopover = (): void => {
		setIsOpen(true);
	};

	const closePopover = (): void => {
		setIsOpen(false);
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const newTime = e.target.value;
		setTimeInput(newTime);

		if (newTodo.dueDate && newTime.match(/^([01]\d|2[0-3]):([0-5]\d)$/)) {
			const [hours, minutes] = newTime.split(':').map(Number);
			let updatedDate = setHours(newTodo.dueDate as Date, hours);
			updatedDate = setMinutes(updatedDate, minutes);
			setNewTodo((old) => ({
				...old,
				dueDate: updatedDate
			}));
		}
	};

	const handleDateSelect = (date: Date | undefined): void => {
		if (date) {
			let updatedDate = date;
			if (timeInput.match(/^([01]\d|2[0-3]):([0-5]\d)$/)) {
				const [hours, minutes] = timeInput.split(':').map(Number);
				updatedDate = setHours(updatedDate, hours);
				updatedDate = setMinutes(updatedDate, minutes);
			} else if (newTodo.dueDate) {
				// If no valid time input, but a previous dueDate exists, retain its time
				updatedDate = setHours(
					updatedDate,
					(newTodo.dueDate as Date).getHours()
				);
				updatedDate = setMinutes(
					updatedDate,
					(newTodo.dueDate as Date).getMinutes()
				);
			} else {
				// If no valid time input and no previous dueDate, default to current time
				updatedDate = setHours(updatedDate, new Date().getHours());
				updatedDate = setMinutes(updatedDate, new Date().getMinutes());
			}
			setNewTodo((old) => ({
				...old,
				dueDate: updatedDate
			}));
		} else {
			setNewTodo((old) => ({
				...old,
				dueDate: undefined
			}));
		}
	};

	const handleAllDayChange = (checked: boolean): void => {
		if (checked && newTodo.dueDate) {
			// If all-day is checked, set the time to midnight.
			const date = new Date(newTodo.dueDate);
			date.setHours(0, 0, 0, 0);
			setNewTodo((old) => ({
				...old,
				dueDate: date,
				allDay: true
			}));
		} else {
			setNewTodo((old) => ({
				...old,
				allDay: checked
			}));
		}
	};

	return (
		<Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-full justify-start text-left font-normal',
						newTodo.dueDate === undefined && 'text-muted-foreground'
					)}
					disabled={isDisabled}>
					<CalendarIcon className='mr-2 h-6 w-6' />
					{newTodo.dueDate !== undefined ? (
						newTodo.allDay ? (
							format(newTodo.dueDate as Date, 'E, MMM do') + ', all day'
						) : (
							format(newTodo.dueDate as Date, 'E, MMM do, hh:mm a')
						)
					) : (
						<span>Due date</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				onOpenAutoFocus={(e) => {
					e.preventDefault();
				}}
				align='start'
				className='flex w-auto flex-col space-y-2 bg-slate-50 p-2'>
				<div className='flex justify-around'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild={true}>
								<button
									className='text-emerald-500 hover:text-emerald-600'
									onClick={() => {
										const today = addDays(new Date(), 0);
										handleDateSelect(today);
									}}>
									<Today size='1.5rem' />
								</button>
							</TooltipTrigger>
							<TooltipContent className='bg-green-500'>
								<p className='font-bold text-white'>Today</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild={true}>
								<button
									className='text-amber-500 hover:text-amber-600'
									onClick={() => {
										const tomorrow = addDays(new Date(), 1);
										handleDateSelect(tomorrow);
									}}>
									<Tomorrow size='1.5rem' />
								</button>
							</TooltipTrigger>
							<TooltipContent className='bg-amber-500'>
								<p className='font-bold text-white'>Tomorrow</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild={true}>
								<button
									className='text-cyan-500 hover:text-cyan-600'
									onClick={() => {
										const in3Days = addDays(new Date(), 3);
										handleDateSelect(in3Days);
									}}>
									<In3Days size='1.5rem' />
								</button>
							</TooltipTrigger>
							<TooltipContent className='bg-sky-500'>
								<p className='font-bold text-white'>In 3 days</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild={true}>
								<button
									className='text-rose-500 hover:text-rose-600'
									onClick={() => {
										const inAWeek = addDays(new Date(), 7);
										handleDateSelect(inAWeek);
									}}>
									<InAWeek size='1.5rem' />
								</button>
							</TooltipTrigger>
							<TooltipContent className='bg-rose-500'>
								<p className='font-bold text-white'>In a week</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild={true}>
								<button
									className='text-gray-500 hover:text-gray-600'
									onClick={() => {
										handleDateSelect(undefined);
									}}>
									<NoDate size='1.5rem' />
								</button>
							</TooltipTrigger>
							<TooltipContent className='bg-gray-500'>
								<p className='font-bold text-white'>No date</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				<div className='rounded-md border bg-white'>
					<Calendar
						mode='single'
						selected={newTodo.dueDate as Date}
						onSelect={handleDateSelect}
					/>
				</div>
				<div className='items-left flex flex-col justify-between p-2'>
					<div className='mb-1 flex items-center gap-2'>
						<Checkbox
							id='checkbox-all-day'
							checked={newTodo.allDay}
							onCheckedChange={handleAllDayChange}
							className='h-5 w-5 rounded-md border-2 border-fuchsia-500 text-sm data-[state=checked]:bg-white'
						/>
						<span
							className={`text-sm ${newTodo.allDay ? 'font-semibold' : 'text-gray-600'}`}>
							All day
						</span>
					</div>
					{!newTodo.allDay && (
						<div className='flex items-center justify-center'>
							<Clock size='1.5rem' className='mr-2 text-fuchsia-500' />
							<label className='flex items-center gap-2'>
								<div className='text-sm'>
									Set <span className='mr-1 font-semibold'>time:</span>
								</div>
								<input
									type='time'
									value={timeInput}
									onChange={handleTimeChange}
									className='rounded-md border p-1 text-sm hover:cursor-pointer'
								/>
							</label>
						</div>
					)}
				</div>
				<Button
					onClick={closePopover}
					className='mt-2 flex w-full items-center justify-center rounded-xl border-2 border-black bg-violet-500 p-3 text-black hover:bg-violet-600 focus-visible:ring-2 focus-visible:ring-violet-500 disabled:bg-violet-200'>
					Done
				</Button>
			</PopoverContent>
		</Popover>
	);
}
