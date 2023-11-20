import React, { useState, type CSSProperties, useRef } from 'react';

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
import { useToast } from '../ui/toast/use-toast';

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
	const [status, setStatus] = useState('typing');
	const inputRefCount = useRef<HTMLDivElement>(null);
	const { toast } = useToast();

	const createHandleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		event.preventDefault();
		if (newList === '') return;
		setStatus('submitting');

		try {
			await addList(newList);
			toast({
				title: 'List was created!',
				description: '',
			});
			closePopover();
		} catch (error) {
			if (error instanceof Error) {
				toast({
					variant: 'destructive',
					title: 'There was an error creating list: ',
					description: error.message,
				});
			}
			setStatus('typing');
		}
	};

	function openPopover(): void {
		setNewList('');
		setStatus('typing');
		setIsOpen(true);
	}

	function closePopover(): void {
		setIsOpen(false);
	}

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
							<ArchiveAdd size='1.6rem' />
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
					className='flex flex-col'
					onSubmit={(e) => {
						createHandleSubmit(e)
							.then(() => {})
							.catch(() => {});
					}}>
					<div className='relative flex flex-1 flex-col'>
						<input
							id='listName'
							name='title'
							type='text'
							value={newList}
							placeholder='Name this list'
							className='m-4 h-10 rounded-xl bg-gray-300 p-4 text-gray-900 placeholder:text-gray-500'
							onChange={(event) => {
								setNewList(event.target.value);
							}}
							onFocus={(e) => {
								(inputRefCount.current as HTMLDivElement).style.display =
									'block';
							}}
							onBlur={(e) => {
								(inputRefCount.current as HTMLDivElement).style.display =
									'none';
							}}
							disabled={status === 'submitting'}
							maxLength={75}
							required
						/>
						<div
							id='listTitleCount'
							ref={inputRefCount}
							className={`absolute bottom-0 right-6 text-[10px] ${
								newList.length < 38 ? 'text-gray-400' : 'text-amber-500'
							}`}>
							<span id='current'>{newList.length}</span>
							<span id='maximum'>/75</span>
						</div>
					</div>
					<div className='mb-4 ml-4 mr-4 flex items-center justify-end'>
						<PopoverClose asChild={true}>
							<button
								className='flex h-9 w-fit items-center justify-center rounded-xl border-2 border-black bg-gray-300 p-3 text-lg text-black hover:bg-gray-400 focus-visible:ring focus-visible:ring-rose-300 disabled:bg-rose-200'
								disabled={status === 'submitting'}>
								Cancel
							</button>
						</PopoverClose>
						<button
							type='submit'
							className='ml-4 flex h-9 w-fit items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 focus-visible:ring focus-visible:ring-cyan-300 disabled:bg-cyan-200'
							disabled={!!(status === 'submitting' || newList.length === 0)}>
							<Spinner
								color='rgb(147 51 234)'
								loading={status === 'submitting'}
								cssOverride={override}
								size={20}
								aria-label='Loading Spinner'
								data-testid='loader'
							/>
							<span className={status === 'submitting' ? 'invisible' : 'block'}>
								Save
							</span>
						</button>
					</div>
				</form>
				<PopoverArrow className='fill-violet-500' />
			</PopoverContent>
		</Popover>
	);
}
