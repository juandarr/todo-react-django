import React, { useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useModal } from '../../contexts/ModalContext';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '../ui/tooltip';

import CreateModalTodo from '../modals/createModalTodo';

import {
	House,
	Heart,
	HamburgerMenu,
	CloseSquare,
	SidebarRight
} from 'iconsax-reactjs';

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
	showSidebar,
	setShowSidebar,
	settings,
	editSetting,
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
		<nav className='relative mx-6 mb-1.5 mt-2.5 flex w-[96%] justify-between rounded-lg border-2 border-black bg-white p-2 md:mb-6 md:mt-12 md:w-5/6'>
			<div
				className='flex w-2/12 justify-start pl-3 text-2xl md:w-1/12'
				onClick={() => {
					setShowSidebar((old) => {
						return !old;
					});
				}}>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild={true}>
							<button
								className={`${showSidebar ? 'sidebar-open' : 'sidebar-close'} text-violet-500 hover:text-violet-600`}>
								{isWindowWidthMedium ? (
									showSidebar ? (
										<CloseSquare size='2.1rem' variant='Bold' />
									) : (
										<HamburgerMenu size='2.1rem' variant='Bold' />
									)
								) : (
									<SidebarRight size='1.8rem' variant='Bold' />
								)}
							</button>
						</TooltipTrigger>
						<TooltipContent className='bg-violet-500'>
							<p className='font-bold text-white'>
								{showSidebar ? 'Close ' : ''}{' '}
								{isWindowWidthMedium ? 'Menu' : 'Sidebar'}
							</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div
				className='flex w-2/12 justify-start pl-3 text-2xl md:w-1/12'
				onClick={(event) => {
					const b = event.target as any;
					b.classList.add('click-gelatine');
					changeCurrentView(user.homeListId);
					setTimeout(() => b.classList.remove('click-gelatine'), 500);
				}}>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild={true}>
							<button className=' text-cyan-400 hover:text-cyan-500'>
								<House
									size={isWindowWidthMedium ? '2.1rem' : '1.8rem'}
									variant='Bold'
									onClick={(event) => {
										const b = event.target as any;
										b.classList.add('click-gelatine');
										changeCurrentView(user.homeListId);
										setTimeout(() => b.classList.remove('click-gelatine'), 500);
									}}
								/>
							</button>
						</TooltipTrigger>
						<TooltipContent className='bg-cyan-500'>
							<p className='font-bold text-white'>Home</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div className='flex w-4/12 justify-center text-2xl md:w-8/12'>
				<CreateModalTodo
					lists={lists}
					userInfo={userInfo}
					addTodo={addTodo}
					isWindowWidthMedium={isWindowWidthMedium}
				/>
			</div>
			<div className='flex w-2/12 justify-end pl-3 pr-3 text-2xl md:w-1/12 '>
				<GoalsModal todos={todos} isWindowWidthMedium={isWindowWidthMedium} />
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
