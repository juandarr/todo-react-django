import React, { useEffect } from 'react';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';

import CreateModalTodo from '../modals/createModalTodo';
import { SidebarLeft, House, StatusUp, Setting2 } from 'iconsax-react';

import type { NavBarProps } from '../../lib/customTypes';
import { userSettings } from '../../lib/userSettings';
import { isDescendantOf } from '../../lib/utils';

export default function NavBar({
	changeCurrentList,
	lists,
	addTodo,
	setShowSidebar,
}: NavBarProps): React.JSX.Element {
	const call = (event: any): void => {
		if (!isDescendantOf(event.target, 'form')) {
			if (event.key === 'h') {
				event.preventDefault();
				changeCurrentList(userSettings.homeListId);
			}
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', call);
		return () => {
			document.removeEventListener('keydown', call);
		};
	}, [call]);
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
					changeCurrentList(userSettings.homeListId);
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
				<CreateModalTodo lists={lists} addTodo={addTodo} />
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
		</nav>
	);
}
