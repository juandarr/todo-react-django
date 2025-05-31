import React, { useState, useRef } from 'react';

import type { CreateModalListProps } from '../../lib/customTypes';

import { CloseSquare, ArchiveAdd } from 'iconsax-reactjs';

import { Emoji } from 'frimousse';
import { MyEmojiPicker } from '../ui/myemojipicker';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '../ui/tooltip';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	PopoverArrow,
	PopoverClose
} from '../ui/popover';

import { useToast } from '../ui/toast/use-toast';

export default function CreateModalList({
	addList
}: CreateModalListProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const [newList, setNewList] = useState('');
	const [selectedEmoji, setSelectedEmoji] = useState('📓');
	const [status, setStatus] = useState('typing');

	const inputRefCount = useRef<HTMLDivElement>(null);

	const { toast } = useToast();

	const createHandleSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		event.preventDefault();
		if (newList === '') return;
		setStatus('submitting');

		try {
			const listTitleWithEmoji = selectedEmoji
				? `${selectedEmoji} ${newList}`
				: newList;
			await addList(listTitleWithEmoji);
			toast({
				title: 'List was created!',
				description: ''
			});
			closePopover();
		} catch (error) {
			if (error instanceof Error) {
				toast({
					variant: 'destructive',
					title: 'There was an error creating list: ',
					description: error.message
				});
			}
			setStatus('typing');
		}
	};

	const onEmojiSelect = ({ emoji }: Emoji) => setSelectedEmoji(emoji);

	function openPopover(): void {
		setNewList('');
		setSelectedEmoji('📓');
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
							<ArchiveAdd size='1.6rem' variant='Bulk' />
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className='bg-violet-500'>
						<p className='font-bold text-white'>Create List</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent
				align={'center'}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}
				className='min-w-80 data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='createlistform'
					className='flex flex-col'
					onSubmit={(e) => {
						createHandleSubmit(e)
							.then(() => {})
							.catch(() => {});
					}}>
					<div className='relative flex flex-1 flex-col'>
						<div className='m-4 flex items-center'>
							<Popover modal={true}>
								<PopoverTrigger
									asChild={true}
									className='cursor-pointer text-4xl'>
									<span className='flex-shrink-0 pl-0 pr-2 hover:opacity-70'>
										{selectedEmoji}
									</span>
								</PopoverTrigger>
								<PopoverContent className='w-fit p-0'>
									<MyEmojiPicker onEmojiSelect={onEmojiSelect} />
									<PopoverArrow className='fill-amber-500' />
								</PopoverContent>
							</Popover>
							<input
								id='listName'
								name='title'
								type='text'
								value={newList}
								placeholder='Name new list'
								className='h-10 min-w-0 flex-1 rounded-xl bg-gray-300 pl-4 pr-4 text-gray-900 placeholder:text-gray-400 focus-within:outline focus-within:outline-2 focus-within:outline-violet-500'
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
						</div>
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
					<div className='m-4 mt-1 flex items-center justify-end'>
						<button
							type='submit'
							className='flex h-9 w-fit items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 focus-visible:ring focus-visible:ring-cyan-300 disabled:bg-cyan-200'
							disabled={!!(status === 'submitting' || newList.length === 0)}>
							<span
								className={`loader ${
									status === 'submitting' ? 'block' : 'invisible'
								}`}></span>
							<span className={status === 'submitting' ? 'invisible' : 'block'}>
								Create
							</span>
						</button>
						<PopoverClose
							className='absolute right-2 top-2 text-gray-400 hover:text-gray-500'
							aria-label='Close'>
							<CloseSquare />
						</PopoverClose>
					</div>
				</form>
				<PopoverArrow className='fill-violet-500' />
			</PopoverContent>
		</Popover>
	);
}
