import React, { useContext, useMemo, useState } from 'react';
import { CalendarTick, CardEdit, Link21, StatusUp, Sun1 } from 'iconsax-react';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	PopoverArrow,
} from '../ui/popover';

import type { GoalsModalProps } from '../../lib/customTypes';
import { UserContext } from '../../contexts/UserContext';

export default function GoalsModal({
	todos,
}: GoalsModalProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const user = useContext(UserContext);

	const openPopover = (): void => {
		setIsOpen(true);
	};

	const options: Intl.DateTimeFormatOptions = {
		month: 'long',
		timeZone: user.timeZone,
	};

	const monthLabel = useMemo(() => {
		if (user.timeZone !== '') {
			return new Date().toLocaleDateString('en-US', options);
		}
		return 'dummy';
	}, [user.timeZone]);

	const completedCounter = useMemo(() => {
		if (user.timeZone !== '') {
			// todos in day
			const today = new Date().toLocaleDateString('en-US', {
				timeZone: user.timeZone,
			});
			const day = todos.reduce((accum, todo) => {
				if (
					todo.complete === true &&
					todo.completedAt?.toLocaleDateString('en-US', {
						timeZone: user.timeZone,
					}) === today
				) {
					return accum + 1;
				}
				return accum;
			}, 0);

			// todos in week
			const tmp = new Date();
			const first = new Date(
				tmp.getFullYear(),
				tmp.getMonth(),
				tmp.getDate() - tmp.getDay() + 1,
			);
			const last = new Date(
				tmp.getFullYear(),
				tmp.getMonth(),
				tmp.getDate() - tmp.getDay() + 7,
				23,
				59,
				59,
			);
			const week = todos.reduce((accum, todo) => {
				if (
					todo.complete === true &&
					todo.completedAt !== null &&
					todo.completedAt !== undefined
				) {
					const tmpWeek = todo.completedAt;
					if (tmpWeek >= first && tmpWeek <= last) {
						return accum + 1;
					}
				}
				return accum;
			}, 0);

			// todos in month
			const thisMonth = new Date()
				.toLocaleDateString('en-US', {
					timeZone: user.timeZone,
				})
				.split('/');
			const month = todos.reduce((accum, todo) => {
				let tmpMonth;
				if (
					todo.complete === true &&
					todo.completedAt !== null &&
					todo.completedAt !== undefined
				) {
					tmpMonth = todo.completedAt
						.toLocaleDateString('en-US', {
							timeZone: user.timeZone,
						})
						.split('/');
					if (thisMonth[0] === tmpMonth[0] && thisMonth[2] === tmpMonth[2]) {
						return accum + 1;
					}
				}
				return accum;
			}, 0);
			return { day, week, month };
		}
		return { day: 0, week: 0, month: 0 };
	}, [todos, user.timeZone]);

	const streakCounter = useMemo(() => {
		if (user.timeZone !== '') {
			let date = new Date();
			const previousDays: Array<Record<string, boolean>> = [];
			for (let i = 0; i < 7; i += 1) {
				previousDays.push({
					[date.getDate() +
					'-' +
					date.toLocaleDateString('en-US', { weekday: 'short' })]: false,
				});
				date.setDate(date.getDate() - 1);
			}
			console.log(previousDays, 'here are the days');
			// streak before today
			let idx = 0;
			let streak = 0;
			date = new Date();
			let tmp = todos.find(
				(todo) =>
					todo.complete === true &&
					todo.completedAt?.toDateString() === date.toDateString(),
			);
			if (tmp !== undefined) {
				previousDays[idx][
					date.getDate() +
						'-' +
						date.toLocaleDateString('en-US', { weekday: 'short' })
				] = true;
				streak += 1;
			}
			let penalty = 0;
			/* TODO : This algorithm is not efficient at all. Streak should be calculated based on a historic collection of past streak data. Redoit in the future */
			do {
				idx += 1;
				date.setDate(date.getDate() - 1);
				console.log('Exploring: ', date.toDateString());
				tmp = todos.find(
					(todo) =>
						todo.complete === true &&
						todo.completedAt?.toDateString() === date.toDateString(),
				);
				if (tmp !== undefined) {
					if (idx <= 6) {
						previousDays[idx][
							date.getDate() +
								'-' +
								date.toLocaleDateString('en-US', { weekday: 'short' })
						] = true;
					}
					streak += 1;
					penalty = 0;
				} else {
					penalty += 1;
				}
			} while (penalty < 2 || idx <= 6); // Allow gaps (penalty < 2, can miss one day max) or not (penalty < 1, no misses allowed)
			console.log('Array before reverse: ', previousDays);
			return { streak, previousDays: previousDays.reverse() };
		}
		return { streak: 0, previousDays: [] };
	}, [todos, user.timeZone]);

	console.log('Modal goals opened', streakCounter.previousDays);
	return (
		<Popover modal={false} open={isOpen} onOpenChange={setIsOpen}>
			<TooltipProvider>
				<Tooltip>
					<PopoverTrigger
						asChild={true}
						onClick={(event) => {
							openPopover();
						}}>
						<TooltipTrigger asChild={true}>
							<button className='text-fuchsia-500 hover:text-fuchsia-600'>
								<StatusUp size='1.8rem' />
							</button>
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className='bg-fuchsia-500'>
						<p className='font-bold text-white'>Progress</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent
				align={'center'}
				side={'bottom'}
				onOpenAutoFocus={(event) => {}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}
				className='max-h-[80vh] w-96 data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='listform'
					className='flex flex-col'
					onSubmit={(e) => {
						e.preventDefault();
					}}>
					<div className='flex-col items-center justify-start'>
						<h1 className='mb-2 ml-3 mr-3 mt-3 text-xl font-bold text-fuchsia-500'>
							Progress
						</h1>
						<div className='mb-3 ml-3 text-sm'>
							The home of your goals and progress.
						</div>
						<div className='relative mb-6 ml-3 mr-3 text-lg font-bold text-cyan-500'>
							Completed <span className='text-sm'>tasks</span>
							<div className='absolute -bottom-2 left-36 text-xs text-cyan-500'>
								* {options.timeZone !== '' ? monthLabel : 'dummy'}
							</div>
						</div>
						<div className='mb-6 ml-3 mr-3 flex items-center justify-around'>
							<div className=' relative flex w-1/3 items-center justify-center text-yellow-500'>
								<Sun1 size='2rem' variant='Broken' />

								<div className='absolute -bottom-3 left-[68%] font-Maple text-2xl'>
									{completedCounter.day}
								</div>
							</div>
							<div className='relative flex w-1/3 items-center justify-center text-emerald-500'>
								<CardEdit size='2rem' variant='Broken' />
								<div className='absolute -bottom-3 left-[68%] font-Maple text-2xl'>
									{completedCounter.week}
								</div>
							</div>
							<div className='relative flex w-1/3 items-center justify-center text-orange-500'>
								<CalendarTick size='2rem' variant='Broken' />
								<div className='absolute -bottom-3 left-[68%] font-Maple text-2xl'>
									{completedCounter.month}
								</div>
							</div>
						</div>
						<div className='relative mb-6 ml-3 mr-3 mt-2 text-lg font-bold text-violet-500'>
							Streak
							<div className='absolute -bottom-2 left-16 text-xs text-violet-500'>
								* Don&apos;t break the chain
							</div>
						</div>
						<div className='mb-4 ml-3 mr-3 flex items-center justify-around'>
							<div className='relative flex w-1/3 items-center justify-center text-rose-500'>
								<Link21 size='2rem' variant='Broken' />
								<div className='absolute -bottom-3 left-[68%] font-Maple text-2xl'>
									{streakCounter.streak}
								</div>
							</div>
							<div className='flex w-2/3 flex-row items-center justify-evenly text-rose-500'>
								{streakCounter.previousDays.map((previousDay, idx) => (
									<div
										key={idx}
										className='flex flex-col items-center justify-start'>
										<div className='px-1.5 font-Maple  text-xs font-semibold text-cyan-500'>
											{Object.entries(previousDay)[0][0].split('-')[1][0]}
										</div>
										<div
											className={`flex w-6 items-center justify-center rounded-[50%] border-2 font-Maple text-xs font-semibold leading-5 ${
												Object.entries(previousDay)[0][1]
													? 'border-emerald-500 text-emerald-500'
													: 'border-transparent'
											}`}>
											{Object.entries(previousDay)[0][0].split('-')[0]}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</form>
				<PopoverArrow className='fill-fuchsia-500' />
			</PopoverContent>
		</Popover>
	);
}
