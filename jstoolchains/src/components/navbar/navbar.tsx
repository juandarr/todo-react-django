import React, { useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

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
	PasswordCheck,
	UserSquare,
	Heart,
} from 'iconsax-reactjs';

import type { NavBarProps } from '../../lib/customTypes';
import { isDescendantOf } from '../../lib/utils';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import SettingsModal from '../modals/settingsModal';
import GoalsModal from '../modals/goalsModal';

export default function NavBar({
	changeCurrentView,
	lists,
	todos,
	userInfo,
	addTodo,
	setShowSidebar,
	settings,
	editSetting,
}: NavBarProps): React.JSX.Element {
	const isOnline = useOnlineStatus();
	const user = useContext(UserContext);

	const homeCallback = (event: KeyboardEvent): void => {
		if (!isDescendantOf(event.target as HTMLElement, 'form')) {
			if (event.key === 'h') {
				event.preventDefault();
				changeCurrentView(user.homeListId);
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
		<nav className='relative mx-6 mb-6 mt-12 flex w-5/6 justify-between rounded-lg border-2 border-black bg-white p-2'>
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
								<SidebarLeft size='1.8rem'  />
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
					changeCurrentView(user.homeListId);
				}}>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild={true}>
							<button className='text-rose-400 hover:text-rose-500'>
								<House size='1.8rem' variant='Broken' />
							</button>
						</TooltipTrigger>
						<TooltipContent className='bg-rose-500'>
							<p className='font-bold text-white'>Home</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div className='flex w-8/12 justify-center text-2xl'>
				<CreateModalTodo lists={lists} userInfo={userInfo} addTodo={addTodo} />
			</div>
			<div className='flex w-1/12 justify-end pl-3 pr-3 text-2xl '>
				<GoalsModal todos={todos} />
			</div>
			<div className='flex w-1/12 justify-end pl-3 pr-3 text-2xl '>
				<Popover modal={true}>
					<TooltipProvider>
						<Tooltip>
							<PopoverTrigger
								asChild={true}
								className='flex cursor-pointer justify-center text-2xl'>
								<TooltipTrigger asChild={true}>
									<button className='text-amber-500 hover:text-amber-600'>
										<UserSquare size='1.8rem'  />
									</button>
								</TooltipTrigger>
							</PopoverTrigger>
							<TooltipContent className='bg-amber-500'>
								<p className='font-bold text-white'>Profile</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<PopoverContent
						align={'center'}
						className='w-fit data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'
						onCloseAutoFocus={(event) => {
							event.preventDefault();
						}}>
						<div className='flex flex-col'>
							<SettingsModal
								lists={lists}
								settings={settings}
								editSetting={editSetting}
							/>
							<a
								href='/accounts/password_change'
								className='mb-2 flex items-center justify-start font-semibold text-rose-500 hover:text-rose-600'>
								<PasswordCheck size='1.8rem' />
								<p className='ml-4'>Change password</p>
							</a>
							<a
								href='/logout'
								className='mb-2 flex items-center justify-start font-semibold text-violet-500 hover:text-violet-600'>
								<Logout size='1.8rem' />
								<p className='ml-4'>Logout</p>
							</a>
						</div>
						<PopoverArrow className='fill-amber-500' />
					</PopoverContent>
				</Popover>
			</div>
			<Heart
				size='12'
				variant='Bulk'
				className={`${
					isOnline ? 'text-emerald-500' : 'text-rose-500'
				} absolute right-1 top-1`}
			/>
		</nav>
	);
}
