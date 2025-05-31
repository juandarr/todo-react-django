import React, { useState, useEffect } from 'react';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	PopoverArrow
} from '../ui/popover';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '../ui/tooltip';

import SettingsModal from '../modals/settingsModal';

import { Logout, PasswordCheck, UserSquare } from 'iconsax-reactjs';
import { ProfileModalProps } from '../../lib/customTypes';
import { useModal } from '../../contexts/ModalContext';

export default function ProfileModal({
	settings,
	editSetting,
	lists
}: ProfileModalProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const { setIsModalOpen } = useModal();

	useEffect(() => {
		setIsModalOpen(isOpen);
	}, [isOpen]);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<TooltipProvider>
				<Tooltip>
					<PopoverTrigger
						asChild={true}
						className='flex cursor-pointer justify-center text-2xl'>
						<TooltipTrigger asChild={true}>
							<button className='text-amber-500 hover:text-amber-600'>
								<UserSquare size='1.8rem' variant='Bulk' />
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
						<PasswordCheck size='1.8rem' variant='Bulk' />
						<p className='ml-4'>Change password</p>
					</a>
					<a
						href='/logout'
						className='mb-2 flex items-center justify-start font-semibold text-violet-500 hover:text-violet-600'>
						<Logout size='1.8rem' variant='Bulk' />
						<p className='ml-4'>Logout</p>
					</a>
				</div>
				<PopoverArrow className='fill-amber-500' />
			</PopoverContent>
		</Popover>
	);
}
