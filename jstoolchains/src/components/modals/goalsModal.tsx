import React, { useContext, useMemo, useState } from 'react';
import {
	CalendarTick,
	CardEdit,
	Link21,
	NotificationCircle,
	StatusUp,
	Sun1,
} from 'iconsax-react';

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
import { useToast } from '../ui/toast/use-toast';
import { UserContext } from '../../contexts/UserContext';

export default function GoalsModal({
	todos,
}: GoalsModalProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const user = useContext(UserContext);

	const { toast } = useToast();

	// const closePopover = (): void => {
	// 	setIsOpen(false);
	// };

	const openPopover = (): void => {
		setIsOpen(true);
		toast({ title: 'Modal opened!', description: '' });
	};

	const options: Intl.DateTimeFormatOptions = {
		month: 'long',
		timeZone: user.timeZone,
	};
	const tmpMonth = useMemo(() => {
		if (user.timeZone !== '') {
			return new Date().toLocaleDateString('en-US', options);
		}
		return 'dummy';
	}, [user.timeZone]);

	console.log('Modal goals opened');
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
							Metrics and statistics
						</h1>
						<p className='mb-3 ml-3 text-sm'>
							The home of your goals and progress.
						</p>
						<div className='relative mb-6 ml-3 mr-3 text-lg font-bold text-sky-500'>
							Todos completed
							<div className='absolute -bottom-2 left-44 text-xs text-emerald-500'>
								* {options.timeZone !== '' ? tmpMonth : 'dummy'}
							</div>
						</div>
						<div className='mb-6 ml-3 mr-3 flex items-center justify-around'>
							<div className=' relative flex w-1/3 items-center justify-center text-yellow-500'>
								<Sun1 size='2rem' />

								<div className='absolute -bottom-3 left-[65%] text-xl font-bold'>
									3
								</div>
							</div>
							<div className='relative flex w-1/3 items-center justify-center text-violet-500'>
								<CardEdit size='2rem' />
								<div className='absolute -bottom-3 left-[65%] text-xl font-bold'>
									10
								</div>
							</div>
							<div className='relative flex w-1/3 items-center justify-center text-orange-500'>
								<CalendarTick size='2rem' />
								<div className='absolute -bottom-3 left-[65%] text-xl font-bold'>
									22
								</div>
							</div>
						</div>
						<div className='relative mb-6 ml-3 mr-3 mt-2 text-lg font-bold text-emerald-500'>
							Streak
							<div className='absolute -bottom-2 left-16 text-xs text-violet-500'>
								* Don&apos;t break the chain
							</div>
						</div>
						<div className='mb-4 ml-3 mr-3 flex items-center justify-around'>
							<div className='relative flex w-1/3 items-center justify-center text-rose-500'>
								<Link21 size='2rem' />
								<div className='absolute -bottom-3 left-[65%] text-xl font-bold'>
									5
								</div>
							</div>
							<div className='flex w-2/3 items-center justify-center text-lime-500'>
								<NotificationCircle size='2rem' />
							</div>
						</div>
					</div>
				</form>
				<PopoverArrow className='fill-fuchsia-500' />
			</PopoverContent>
		</Popover>
	);
}
