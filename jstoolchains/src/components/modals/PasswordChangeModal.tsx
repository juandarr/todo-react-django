import React, { useState, useContext, useEffect } from 'react';

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

import { PasswordCheck } from 'iconsax-reactjs';
import { useModal } from '../../contexts/ModalContext';
import { clientUser } from '../../lib/api'; // Assuming an API client for user operations

export default function PasswordChangeModal(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword1, setNewPassword1] = useState('');
	const [newPassword2, setNewPassword2] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	const { setIsModalOpen } = useModal();

	useEffect(() => {
		setIsModalOpen(isOpen);
		if (!isOpen) {
			// Reset form when modal closes
			setOldPassword('');
			setNewPassword1('');
			setNewPassword2('');
			setError('');
			setSuccessMessage('');
		}
	}, [isOpen, setIsModalOpen]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		setError('');
		setSuccessMessage('');

		if (newPassword1 !== newPassword2) {
			setError('New passwords do not match.');
			setIsLoading(false);
			return;
		}

		try {
			// This is a placeholder for the actual API call.
			// You will need to implement a Django API endpoint for password change.
			// For now, it simulates a successful call.
			// await clientUser.changePassword({ oldPassword, newPassword1, newPassword2 });
			console.log('Simulating password change API call...');
			await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

			setSuccessMessage('Password changed successfully!');
			setOldPassword('');
			setNewPassword1('');
			setNewPassword2('');
		} catch (err) {
			console.error('Password change failed:', err);
			setError('Failed to change password. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<TooltipProvider>
				<Tooltip>
					<PopoverTrigger
						asChild={true}
						className='flex cursor-pointer justify-center text-2xl'>
						<TooltipTrigger asChild={true}>
							<button className='mb-2 flex items-center justify-start font-semibold text-rose-500 hover:text-rose-600'>
								<PasswordCheck size='1.8rem' variant='Bulk' />
								<p className='ml-4'>Change password</p>
							</button>
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className='bg-rose-500'>
						<p className='font-bold text-white'>Change Password</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent
				align={'center'}
				className='w-fit data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}>
				<form className='flex flex-col p-4' onSubmit={handleSubmit}>
					<h1 className='mb-4 text-xl font-bold text-rose-500'>
						Change Password
					</h1>
					{error && <p className='mb-2 text-red-500'>{error}</p>}
					{successMessage && (
						<p className='mb-2 text-green-500'>{successMessage}</p>
					)}

					<div className='mb-4'>
						<label className='mb-1 block font-semibold text-gray-700'>
							Old password:
						</label>
						<input
							type='password'
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
							className='w-full rounded-md border border-gray-300 p-2'
							required
						/>
					</div>
					<div className='mb-4'>
						<label className='mb-1 block font-semibold text-gray-700'>
							New password:
						</label>
						<input
							type='password'
							value={newPassword1}
							onChange={(e) => setNewPassword1(e.target.value)}
							className='w-full rounded-md border border-gray-300 p-2'
							required
						/>
					</div>
					<div className='mb-6'>
						<label className='mb-1 block font-semibold text-gray-700'>
							Confirm new password:
						</label>
						<input
							type='password'
							value={newPassword2}
							onChange={(e) => setNewPassword2(e.target.value)}
							className='w-full rounded-md border border-gray-300 p-2'
							required
						/>
					</div>
					<button
						type='submit'
						className='flex h-9 w-fit items-center justify-center self-end rounded-xl bg-rose-500 p-3 text-lg font-semibold hover:bg-rose-600 disabled:bg-rose-200'
						disabled={isLoading}>
						{isLoading ? (
							<span className='loader'></span>
						) : (
							<span className='block'>Change Password</span>
						)}
					</button>
				</form>
				<PopoverArrow className='fill-rose-500' />
			</PopoverContent>
		</Popover>
	);
}
