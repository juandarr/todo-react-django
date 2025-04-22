import React, { useState } from 'react';

import type { DeleteModalListProps } from '../../lib/customTypes';

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
	PopoverClose,
} from '../ui/popover';

import { useToast } from '../ui/toast/use-toast';

import { Trash, CloseSquare } from 'iconsax-reactjs';

export default function DeleteModalList({
	deleteFunction,
	deleteEntity,
	id,
	size,
}: DeleteModalListProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [status, setStatus] = useState('viewing');
	const { toast } = useToast();

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		event.preventDefault();
		setStatus('submitting');

		try {
			await deleteFunction(id);
			toast({
				title: `${
					deleteEntity.charAt(0).toUpperCase() + deleteEntity.slice(1)
				} was deleted!`,
				description: '',
			});
			closePopover();
		} catch (error) {
			if (error instanceof Error) {
				toast({
					variant: 'destructive',
					title: `There was an error deleting ${deleteEntity}: `,
					description: error.message,
				});
			}
			setStatus('viewing');
		}
	};

	const closePopover = (): void => {
		setIsOpen(false);
	};

	const openPopover = (): void => {
		setStatus('viewing');
		setIsOpen(true);
	};

	console.log('Delete modal is rendered');
	return (
		<Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
			<TooltipProvider>
				<Tooltip>
					<PopoverTrigger
						asChild={true}
						onClick={() => {
							openPopover();
						}}>
						<TooltipTrigger>
							<a className='flex cursor-pointer justify-center text-rose-500 hover:text-rose-600'>
								<Trash size={`${size}rem`} />
							</a>
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className='bg-rose-500'>
						<p className='font-bold text-white'>Delete List</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent
				align={'center'}
				onOpenAutoFocus={(event) => {}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}
				className='data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='deletelistform'
					className='flex flex-col'
					onSubmit={(e) => {
						handleSubmit(e).catch((error) => {
							console.log('Error deleting entity: ', error);
						});
					}}>
					<div className='m-4 rounded-xl text-left text-gray-900'>
						Are you sure you want to{' '}
						<span className='font-medium text-rose-500'> delete</span> this{' '}
						<span className='font-medium'> list</span>?
					</div>
					<div className='mb-4 ml-4 mr-4 flex items-center justify-end'>
						<button
							type='submit'
							className='ml-4 flex h-9 w-fit items-center justify-center rounded-xl border-2 border-black bg-rose-500 p-3 text-lg text-black hover:bg-rose-600 focus-visible:ring  focus-visible:ring-cyan-300 disabled:bg-rose-100'
							disabled={status === 'submitting'}>
							<span
								className={`loader ${
									status === 'submitting' ? 'block' : 'invisible'
								}`}></span>
							<span className={status === 'submitting' ? 'invisible' : 'block'}>
								Confirm Deletion
							</span>
						</button>
						<PopoverClose
							className='absolute right-2 top-2 text-gray-400 hover:text-gray-500'
							aria-label='Close'>
							<CloseSquare />
						</PopoverClose>
					</div>
				</form>
				<PopoverArrow className='fill-rose-500' />
			</PopoverContent>
		</Popover>
	);
}
