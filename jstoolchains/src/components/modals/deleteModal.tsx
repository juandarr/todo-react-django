import React, { useState, type CSSProperties } from 'react';

import type { DeleteModalProps } from '../../lib/customTypes';

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

import Spinner from 'react-spinners/DotLoader';
import { Trash } from 'iconsax-react';

const override: CSSProperties = {
	display: 'block',
	position: 'absolute',
	justifyContent: 'center',
	alignSelf: 'center',
};

export default function DeleteModal({
	deleteFunction,
	deleteEntity,
	parentId,
	id,
}: DeleteModalProps): React.JSX.Element {
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
					title: `There was an error creating ${deleteEntity}: `,
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

	const toggleHidden = (): void => {
		const el: HTMLElement = document.getElementById(parentId) as HTMLElement;
		if (el !== null) el.classList.toggle('hidden-child');
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
								<Trash size={'1.6rem'} />
							</a>
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className='bg-rose-500'>
						<p className='font-bold text-white'>Delete</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent
				align={'center'}
				onOpenAutoFocus={(event) => {
					toggleHidden();
				}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
					toggleHidden();
				}}
				className='data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='listform'
					className='font-serif flex flex-col'
					onSubmit={(e) => {
						handleSubmit(e).catch((error) => {
							console.log('Error deleting entity: ', error);
						});
					}}>
					<div className='m-4 flex h-8 items-center justify-center rounded-xl p-2 px-4 py-3 text-gray-900'>
						Are you sure to delete?
					</div>
					<div className='mb-4 ml-4 mr-4 flex items-center justify-between'>
						<button
							type='submit'
							className='flex h-10 w-2/5 items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 focus-visible:ring  focus-visible:ring-cyan-300 disabled:bg-cyan-100'
							disabled={status === 'submitting'}>
							<Spinner
								color='rgb(8 145 178)'
								loading={status === 'submitting'}
								cssOverride={override}
								size={20}
								aria-label='Loading Spinner'
								data-testid='loader'
							/>
							<span className={status === 'submitting' ? 'invisible' : 'block'}>
								Yes
							</span>
						</button>
						<PopoverClose asChild={true}>
							<button
								className='flex h-10 w-2/5 items-center justify-center rounded-xl border-2 border-black bg-rose-500 p-3 text-lg text-black hover:bg-rose-500 focus-visible:ring focus-visible:ring-rose-300 disabled:bg-rose-100'
								disabled={status === 'submitting'}>
								Cancel
							</button>
						</PopoverClose>
					</div>
				</form>
				<PopoverArrow className='fill-rose-500' />
			</PopoverContent>
		</Popover>
	);
}
