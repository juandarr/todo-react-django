'use client';

import * as React from 'react';

import {
	Calendar1 as Today,
	SunFog as Tomorrow,
	ArrowRight3 as In3Days,
	Forward as InAWeek,
	Calendar as CalendarIcon,
	CalendarRemove as NoDate
} from 'iconsax-reactjs';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '../ui/tooltip';

import { addDays, format } from 'date-fns';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

import { type DatePickerProps } from '../../lib/customTypes';

export function DatePickerWithPresets({
	newTodo,
	setNewTodo,
	isDisabled
}: DatePickerProps): React.JSX.Element {
	if (newTodo.dueDate !== undefined) {
		console.log('Current date: ', newTodo.dueDate);
	}

	const [isOpen, setIsOpen] = React.useState(false);

	const openPopover = (): void => {
		setIsOpen(true);
	};

	const closePopover = (): void => {
		setIsOpen(false);
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
					disabled={isDisabled}
					onClick={() => {
						openPopover();
					}}>
					<CalendarIcon className='mr-2 h-6 w-6' />
					{newTodo.dueDate !== undefined ? (
						format(newTodo.dueDate as Date, 'E, MMM do')
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
										setNewTodo((old) => ({
											...old,
											dueDate: addDays(new Date(), 0)
										}));
										closePopover();
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
										setNewTodo((old) => ({
											...old,
											dueDate: addDays(new Date(), 1)
										}));
										closePopover();
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
										setNewTodo((old) => ({
											...old,
											dueDate: addDays(new Date(), 3)
										}));
										closePopover();
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
										setNewTodo((old) => ({
											...old,
											dueDate: addDays(new Date(), 7)
										}));
										closePopover();
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
										setNewTodo((old) => ({
											...old,
											dueDate: undefined
										}));
										closePopover();
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
						onSelect={(date) => {
							setNewTodo((old) => ({
								...old,
								dueDate: date
							}));
							closePopover();
						}}
					/>
				</div>
				<form style={{ marginBlockEnd: '1em' }} className='flex flex-col'>
					<label className='justify-around'>
						Set the time: <input type='time' value={0} />
					</label>
				</form>
			</PopoverContent>
		</Popover>
	);
}
