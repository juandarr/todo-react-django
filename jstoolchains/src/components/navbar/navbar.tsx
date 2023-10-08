import React, { useEffect } from 'react';

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

import CreateModalTodo from '../modals/createModalTodo';
import {
	Logout,
	SidebarLeft,
	House,
	StatusUp,
	Setting2,
	PasswordCheck,
	UserSquare,
} from 'iconsax-react';

import type { NavBarProps } from '../../lib/customTypes';
import { isDescendantOf } from '../../lib/utils';

export default function NavBar({
	changeCurrentView,
	lists,
	addTodo,
	userInfo,
	setShowSidebar,
}: NavBarProps): React.JSX.Element {
	const homeCallback = (event: KeyboardEvent): void => {
		if (!isDescendantOf(event.target as HTMLElement, 'form')) {
			if (event.key === 'h') {
				event.preventDefault();
				changeCurrentView(userInfo.homeListId);
			}
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', homeCallback);
		return () => {
			document.removeEventListener('keydown', homeCallback);
		};
	}, [homeCallback]);

	return (
		<nav className='mx-6 mb-6 mt-12 flex w-5/6 justify-between rounded-lg border-2 border-black bg-white p-2'>
			<div
				className='flex w-1/12 justify-start pl-3 text-2xl'
				onClick={() => {
					setShowSidebar((old) => {
						return !old;
					});
				}}>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild={true}>
							<button className='text-violet-500 hover:text-violet-600'>
								<SidebarLeft size='1.8rem' />
							</button>
						</TooltipTrigger>
						<TooltipContent className='bg-violet-500'>
							<p className='font-bold text-white'>Sidebar</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div
				className='flex w-1/12 justify-start pl-3 text-2xl'
				onClick={() => {
					changeCurrentView(userInfo.homeListId);
				}}>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild={true}>
							<button className='text-rose-400 hover:text-rose-500'>
								<House size='1.8rem' />
							</button>
						</TooltipTrigger>
						<TooltipContent className='bg-rose-500'>
							<p className='font-bold text-white'>Home</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div className='flex w-8/12 justify-center text-2xl'>
				<CreateModalTodo lists={lists} addTodo={addTodo} userInfo={userInfo} />
			</div>
			<div className='flex w-1/12 justify-end pl-3 pr-3 text-2xl '>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild={true}>
							<button className='text-fuchsia-500 hover:text-fuchsia-600'>
								<StatusUp size='1.8rem' />
							</button>
						</TooltipTrigger>
						<TooltipContent className='bg-fuchsia-500'>
							<p className='font-bold text-white'>Progress</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div className='flex w-1/12 justify-end pl-3 pr-3 text-2xl '>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild={true}>
							<a href='/admin' className='text-cyan-500 hover:text-cyan-600'>
								<Setting2 size='1.8rem' />
							</a>
						</TooltipTrigger>
						<TooltipContent className='bg-cyan-500'>
							<p className='font-bold text-white'>Settings</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div className='flex w-1/12 justify-end pl-3 pr-3 text-2xl '>
				<Popover modal={true}>
					<TooltipProvider>
						<Tooltip>
							<PopoverTrigger
								asChild={true}
								className='flex cursor-pointer justify-center text-2xl text-violet-500 hover:text-violet-600'>
								<TooltipTrigger asChild={true}>
									<a className='text-amber-500 hover:text-amber-600'>
										<UserSquare size='1.8rem' />
									</a>
								</TooltipTrigger>
							</PopoverTrigger>
							<TooltipContent className='bg-amber-500'>
								<p className='font-bold text-white'>Logout</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<PopoverContent
						align={'center'}
						className='data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
						<div className='flex flex-col'>
							<a
								href='/accounts/password_change'
								className='mb-2 flex items-center justify-start font-semibold text-rose-500 hover:text-rose-600'>
								<PasswordCheck size='1.8rem' />
								<p className='ml-4'>Change password</p>
							</a>
							<a
								href='/logout'
								className='mb-2 flex items-center justify-start font-semibold text-amber-500 hover:text-amber-600'>
								<Logout size='1.8rem' />
								<p className='ml-4'>Logout</p>
							</a>
						</div>
						<PopoverArrow className='fill-violet-500' />
					</PopoverContent>
				</Popover>
			</div>
		</nav>
	);
}
