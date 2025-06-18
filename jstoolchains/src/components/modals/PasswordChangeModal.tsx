import React, { useState, useContext, useEffect } from 'react';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	PopoverArrow
} from '../ui/popover';

import { PasswordCheck } from 'iconsax-reactjs';
import { useModal } from '../../contexts/ModalContext';
import { changePasswordApi } from '../../lib/api'; // Import the new API function
import { toast } from '../ui/toast/use-toast';
import { PasswordChangeModalProps } from '../../lib/customTypes';

export default function PasswordChangeModal({
	isWindowWidthMedium,
	onClose
}: PasswordChangeModalProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword1, setNewPassword1] = useState('');
	const [newPassword2, setNewPassword2] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const { setIsModalOpen } = useModal();

	useEffect(() => {
		setIsModalOpen(isOpen);
		if (!isOpen) {
			// Reset form when modal closes
			setOldPassword('');
			setNewPassword1('');
			setNewPassword2('');
			setError('');
		}
	}, [isOpen]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		setError('');

		if (newPassword1 !== newPassword2) {
			setError('New passwords do not match');
			setIsLoading(false);
			return;
		}

		try {
			await changePasswordApi(oldPassword, newPassword1, newPassword2);
			toast({
				title: 'Password changed succesfully!',
				description: ''
			});
			closePopover();
			onClose(); // Close the parent modal
		} catch (err: any) {
			console.error('Password change failed: ', err);
			const errJSON = JSON.parse(err.message);
			setError(
				errJSON.old_password ||
					errJSON.new_password2 ||
					'Failed to change password. Try again'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const closePopover = (): void => {
		setIsOpen(false);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger
				asChild={true}
				className='flex cursor-pointer justify-center'>
				<button className='mb-2 flex items-center justify-start font-semibold text-orange-500 hover:text-orange-600'>
					<PasswordCheck size='1.8rem' variant='Bulk' />
					<p className='ml-4'>Change password</p>
				</button>
			</PopoverTrigger>
			<PopoverContent
				align={'center'}
				side={isWindowWidthMedium ? 'bottom' : 'left'}
				collisionPadding={{ top: 10, right: 20 }}
				className='w-80 data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}>
				<form className='flex flex-col p-3' onSubmit={handleSubmit}>
					<h1 className='mb-3 text-xl font-bold text-orange-500'>
						Change Password
					</h1>
					<div className='mb-3 text-balance text-sm'>
						Please enter your old password and then enter your new password{' '}
						<b>twice</b> so we can verify you typed it correctly
					</div>
					<div className='mb-3'>
						<label className='mb-1 block text-base font-bold text-gray-700'>
							Current password
						</label>
						<input
							type='password'
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
							className='h-10 w-11/12 min-w-0 flex-1 rounded-xl bg-gray-300 pl-4 pr-4 text-gray-900 placeholder:text-gray-400 focus-within:outline focus-within:outline-2 focus-within:outline-violet-500'
							required
						/>
					</div>
					<div className='mb-3'>
						<label className='mb-1 block text-base font-bold text-gray-700'>
							New password
						</label>
						<input
							type='password'
							value={newPassword1}
							onChange={(e) => setNewPassword1(e.target.value)}
							className='h-10 w-11/12 min-w-0 flex-1 rounded-xl bg-gray-300 pl-4 pr-4 text-gray-900 placeholder:text-gray-400 focus-within:outline focus-within:outline-2 focus-within:outline-violet-500'
							required
						/>
					</div>
					<div className='mb-5'>
						<label className='mb-1 block text-base font-bold text-gray-700'>
							Confirm new password
						</label>
						<input
							type='password'
							value={newPassword2}
							onChange={(e) => setNewPassword2(e.target.value)}
							className='h-10 w-11/12 min-w-0 flex-1 rounded-xl bg-gray-300 pl-4 pr-4 text-gray-900 placeholder:text-gray-400 focus-within:outline focus-within:outline-2 focus-within:outline-emerald-500'
							required
						/>
					</div>
					<button
						type='submit'
						className='flex h-9 w-fit items-center justify-center self-end rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 focus-visible:ring focus-visible:ring-cyan-300 disabled:bg-cyan-200'
						disabled={
							isLoading ||
							newPassword1.length === 0 ||
							newPassword2.length === 0 ||
							oldPassword.length === 0
						}>
						<span
							className={`loader ${isLoading ? 'block' : 'invisible'}`}></span>
						<span className={isLoading ? 'invisible' : 'block'}>Change</span>
					</button>
					{error && (
						<p className='mb-2 mt-2 text-sm font-semibold text-red-500'>
							{error}
						</p>
					)}
				</form>
				<PopoverArrow className='fill-orange-500' />
			</PopoverContent>
		</Popover>
	);
}
