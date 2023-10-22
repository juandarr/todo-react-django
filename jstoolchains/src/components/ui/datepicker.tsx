'use client';

import * as React from 'react';
import {
	ArrowRight3,
	Calendar1,
	Calendar as CalendarIconSax,
	CalendarRemove,
	Forward,
	SunFog,
} from 'iconsax-react';

import { addDays, format } from 'date-fns';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

import { type DatePickerProps } from '../../lib/customTypes';

export function DatePickerWithPresets({
	newTodo,
	setNewTodo,
}: DatePickerProps): React.JSX.Element {
	if (newTodo.dueDate !== undefined) {
		console.log('Current date: ', newTodo.dueDate);
	}

	return (
		<Popover modal={true}>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-full justify-start text-left font-normal',
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
				<div className='flex justify-around'>
					<button
						className='text-green-400 hover:text-green-500'
						onClick={() => {
							setNewTodo((old) => ({
								...old,
								dueDate: addDays(new Date(), 0),
							}));
						}}>
						<Calendar1 size='1.5rem' />
					</button>
					<button
						className='text-amber-400 hover:text-amber-500'
						onClick={() => {
							setNewTodo((old) => ({
								...old,
								dueDate: addDays(new Date(), 1),
							}));
						}}>
						<SunFog size='1.5rem' />
					</button>
					<button
						className='text-sky-400 hover:text-sky-500'
						onClick={() => {
							setNewTodo((old) => ({
								...old,
								dueDate: addDays(new Date(), 3),
							}));
						}}>
						<ArrowRight3 size='1.7rem' />
					</button>
					<button
						className='text-rose-400 hover:text-rose-500'
						onClick={() => {
							setNewTodo((old) => ({
								...old,
								dueDate: addDays(new Date(), 7),
							}));
						}}>
						<Forward size='1.5rem' />
					</button>
					<button
						className='text-gray-400 hover:text-gray-500'
						onClick={() => {
							setNewTodo((old) => ({
								...old,
								dueDate: undefined,
							}));
						}}>
						<CalendarRemove size='1.5rem' />
					</button>
				</div>
				{/* <Select
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
				</Select> */}
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
