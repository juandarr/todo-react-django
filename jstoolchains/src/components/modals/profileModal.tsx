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
import LogoutModal from './logoutModal';

import { Logout, UserSquare } from 'iconsax-reactjs';
import { ProfileModalProps } from '../../lib/customTypes';
import { useModal } from '../../contexts/ModalContext';
import PasswordChangeModal from './PasswordChangeModal'; // Import the new modal

export default function ProfileModal({
	isWindowWidthMedium,
	settings,
	editSetting,
	lists
}: ProfileModalProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const { setIsModalOpen } = useModal();

	const closeProfileModal = (): void => {
		setIsOpen(false);
	};

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
								<UserSquare
									size={isWindowWidthMedium ? '2.1rem' : '1.8rem'}
									variant='Bulk'
								/>
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
				collisionPadding={{ top: 10, right: 10 }}
				className='w-fit data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}>
				<div className='flex flex-col'>
					<SettingsModal
						isWindowWidthMedium={isWindowWidthMedium}
						lists={lists}
						settings={settings}
						editSetting={editSetting}
					/>
					<PasswordChangeModal
						isWindowWidthMedium={isWindowWidthMedium}
						onClose={closeProfileModal}
					/>
					<LogoutModal isWindowWidthMedium={isWindowWidthMedium} />
				</div>
				<PopoverArrow className='fill-amber-500' />
			</PopoverContent>
		</Popover>
	);
}
