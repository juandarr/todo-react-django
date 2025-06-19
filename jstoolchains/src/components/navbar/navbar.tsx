import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useModal } from '../../contexts/ModalContext';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '../ui/tooltip';

import CreateModalTodo from '../modals/createModalTodo';

import { SidebarLeft, House, Heart, HamburgerMenu } from 'iconsax-reactjs';

import type { NavBarProps } from '../../lib/customTypes';
import { isDescendantOf } from '../../lib/utils';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import GoalsModal from '../modals/goalsModal';
import ProfileModal from '../modals/profileModal';

export default function NavBar({
	changeCurrentView,
	lists,
	todos,
	userInfo,
	addTodo,
	setShowSidebar,
	settings,
	editSetting,
	menuButtonRef,
	isWindowWidthMedium
}: NavBarProps): React.JSX.Element {
	const isOnline = useOnlineStatus();
	const user = useContext(UserContext);
	const { isModalOpen } = useModal();

	const homeCallback = (event: KeyboardEvent): void => {
		if (isModalOpen) {
			return; // Home shortcut won't work when any modal is open
		}
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
				ref={menuButtonRef}
				className='flex w-2/12 justify-start pl-3 text-2xl md:w-1/12'
				onClick={() => {
					setShowSidebar((old) => {
						return !old;
					});
				}}>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild={true}>
							<button className='text-violet-500 hover:text-violet-600'>
								{isWindowWidthMedium ? (
									<HamburgerMenu size='1.8rem' variant='Bold' />
								) : (
									<SidebarLeft size='1.8rem' variant='Bold' />
								)}
							</button>
						</TooltipTrigger>
						<TooltipContent className='bg-violet-500'>
							<p className='font-bold text-white'>
								{isWindowWidthMedium ? 'Menu' : 'Sidebar'}
							</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div
				className='flex w-2/12 justify-start pl-3 text-2xl md:w-1/12'
				onClick={() => {
					changeCurrentView(user.homeListId);
				}}>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild={true}>
							<button className='text-cyan-400 hover:text-cyan-500'>
								<House size='1.8rem' variant='Bold' />
							</button>
						</TooltipTrigger>
						<TooltipContent className='bg-cyan-500'>
							<p className='font-bold text-white'>Home</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div className='flex w-4/12 justify-center text-2xl md:w-8/12'>
				<CreateModalTodo lists={lists} userInfo={userInfo} addTodo={addTodo} />
			</div>
			<div className='flex w-2/12 justify-end pl-3 pr-3 text-2xl md:w-1/12 '>
				<GoalsModal todos={todos} />
			</div>
			<div className='flex w-2/12 justify-end pl-3 pr-3 text-2xl md:w-1/12 '>
				<ProfileModal
					isWindowWidthMedium={isWindowWidthMedium}
					settings={settings}
					editSetting={editSetting}
					lists={lists}
				/>
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
