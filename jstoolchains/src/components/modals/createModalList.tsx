import React, { useState, type CSSProperties } from 'react';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';

import { ArchiveAdd } from 'iconsax-react';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	PopoverArrow,
	PopoverClose,
} from '../ui/popover';

import Spinner from 'react-spinners/DotLoader';

import type { CreateModalListProps } from '../../lib/customTypes';

const override: CSSProperties = {
	display: 'block',
	position: 'absolute',
	justifyContent: 'center',
	alignSelf: 'center',
};

export default function CreateModalList({
	addList,
}: CreateModalListProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const [newList, setNewList] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [status, setStatus] = useState('typing');

	const createHandleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		event.preventDefault();
		if (newList === '') return;
		setStatus('submitting');
		// setTimeout(() => {
		// 	const value = Math.random();
		// 	if (value > 0.5) {
		// 		closePopover();
		// 	} else {
		// 		setError('Invented error');
		// 		setStatus('viewing');
		// 	}
		// }, 2000);
		try {
			await addList(newList);
			closePopover();
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			}
			setStatus('typing');
		}
	};

	function openPopover(): void {
		setNewList('');
		setStatus('typing');
		setError(null);
		setIsOpen(true);
	}

	function closePopover(): void {
		setIsOpen(false);
	}

	console.log('Modal create list rendered', isOpen, newList, error, status);
	return (
		<Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
			<TooltipProvider>
				<Tooltip>
					<PopoverTrigger
						asChild={true}
						className='flex cursor-pointer justify-center text-2xl text-violet-500 hover:text-violet-600'
						onClick={(event) => {
							openPopover();
						}}>
						<TooltipTrigger>
							<ArchiveAdd size='1.8rem' />
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className='bg-violet-500'>
						<p className='font-bold text-white'>Add list</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent
				align={'center'}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}
				className='data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='listform'
					className='font-serif flex flex-col'
					onSubmit={(e) => {
						createHandleSubmit(e)
							.then(() => {})
							.catch(() => {});
					}}>
					<input
						id='listName'
						name='title'
						type='text'
						value={newList}
						placeholder='Name this list'
						className='m-4 h-8 rounded-xl bg-gray-300 p-2 px-4 py-3 text-gray-900 placeholder:text-gray-500'
						onChange={(event) => {
							setNewList(event.target.value);
						}}
						disabled={status === 'submitting'}
						required
					/>
					<div className='mb-4 ml-4 mr-4 flex items-center justify-between'>
						<button
							type='submit'
							className='flex h-10 w-2/5 items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 focus-visible:ring focus-visible:ring-cyan-300 disabled:bg-cyan-200'
							disabled={!!(newList.length === 0 || status === 'submitting')}>
							<Spinner
								color='rgb(8 145 178)'
								loading={status === 'submitting'}
								cssOverride={override}
								size={20}
								aria-label='Loading Spinner'
								data-testid='loader'
							/>
							<span className={status === 'submitting' ? 'invisible' : 'block'}>
								Create
							</span>
						</button>
						<PopoverClose asChild={true}>
							<button
								className='flex h-10 w-2/5 items-center justify-center rounded-xl border-2 border-black bg-rose-500 p-3 text-lg text-black hover:bg-rose-600 focus-visible:ring focus-visible:ring-rose-300 disabled:bg-rose-200'
								disabled={status === 'submitting'}>
								Cancel
							</button>
						</PopoverClose>
					</div>
					{error != null && (
						<div className='text-sm font-bold  text-red-500'>
							There was an error creating list: {error}
						</div>
					)}
				</form>
				<PopoverArrow className='fill-violet-500' />
			</PopoverContent>
		</Popover>
	);
}
