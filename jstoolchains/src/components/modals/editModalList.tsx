import React, { useState, useRef, useEffect } from 'react';

import { type EditModalListProps } from '../../lib/customTypes';

import { useModal } from '../../contexts/ModalContext';

import {
	DirectboxReceive as Archive,
	DirectboxSend as UnArchive,
	CloseSquare,
	Edit
} from 'iconsax-reactjs';

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

import DeleteModalList from './deleteModalList';
import { ToastAction } from '@radix-ui/react-toast';

export default function EditModalList({
	editList,
	listData,
	parentId,
	deleteFunction
}: EditModalListProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const [listEdit, setListEdit] = useState<string>('');
	const [selectedEmoji, setSelectedEmoji] = useState('');

	const [status, setStatus] = useState('typing');

	const inputTitle = useRef<HTMLInputElement>(null);
	const inputTitleCount = useRef<HTMLDivElement>(null);

	const { toast } = useToast();

	const { setIsModalOpen } = useModal();

	useEffect(() => {
		setIsModalOpen(isOpen);
	}, [isOpen]);

	useEffect(() => {
		if (status === 'typing') {
			if (inputTitle.current !== null) {
				inputTitle.current.focus();
			}
		}
	}, [status]);

	const editHandleSubmit = async (
		event:
			| React.MouseEvent<HTMLButtonElement, MouseEvent>
			| React.FormEvent<HTMLFormElement>,
		id: number,
		tmpList: { title?: string; archived?: boolean }
	): Promise<void> => {
		event.preventDefault();
		if (tmpList.title === '') return;
		setStatus('submitting');

		try {
			const listTitleWithEmoji = `${selectedEmoji} ${tmpList.title}`;
			tmpList.title = listTitleWithEmoji;
			const updatedList = await editList(id, tmpList);
			console.log('Updated list: ', updatedList);
			toast({
				title: 'List was updated!',
				description: ''
			});
			closePopover();
		} catch (error) {
			if (error instanceof Error) {
				toast({
					variant: 'destructive',
					title: 'There was an error updating the list: ',
					description: error.message
				});
			}
			setStatus('typing');
		}
	};

	const archiveHandleSubmit = async (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	): Promise<void> => {
		event.preventDefault();
		setStatus('submitting');

		try {
			await editList(listData.id, {
				archived: !listData.archived
			});
			toast({
				title: `List was ${listData.archived ? 'restored' : 'archived'}`,
				description: '',
				action: (
					<ToastAction
						altText='Undo archive/restore'
						className='rounded-md bg-violet-500 px-3 py-1 text-white hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2'
						onClick={() => {
							editList(listData.id, {
								archived: listData.archived
							})
								.then(() => {})
								.catch(() => {});
						}}>
						Undo
					</ToastAction>
				)
			});
			closePopover();
		} catch (error) {
			if (error instanceof Error) {
				toast({
					variant: 'destructive',
					title: `There was an error ${
						!listData.archived ? 'restoring' : 'archiving'
					} the list: `,
					description: error.message
				});
			}
			setStatus('viewing');
		}
	};

	const onEmojiSelect = ({ emoji }: Emoji) => setSelectedEmoji(emoji);

	const openPopover = (): void => {
		removeHidden();
		const [emoji, ...titleStr] = listData.title.split(' ');
		setSelectedEmoji(emoji);
		setListEdit(titleStr.join(' '));
		setStatus('typing');
	};

	const closePopover = (): void => {
		setIsOpen(false);
	};

	const removeHidden = (): void => {
		(document.getElementById(parentId) as HTMLElement)?.classList.remove(
			'hidden-child'
		);
	};
	const addHidden = (): void => {
		(document.getElementById(parentId) as HTMLElement)?.classList.add(
			'hidden-child'
		);
	};
	return (
		<Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
			<TooltipProvider>
				<Tooltip>
					<PopoverTrigger
						asChild={true}
						className='flex cursor-pointer justify-end text-2xl text-cyan-500 hover:text-cyan-600'
						onClick={(event) => {
							openPopover();
						}}>
						<TooltipTrigger>
							<Edit size={'1.4rem'} />
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className='bg-sky-500'>
						<p className='font-bold text-white'>Edit List</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent
				align={'center'}
				collisionPadding={{ top: 10, right: 10, left: 10 }}
				onOpenAutoFocus={(event) => {}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
					addHidden();
				}}
				className='min-w-80 data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='editlistform'
					className='flex flex-col'
					onSubmit={(e) => {
						editHandleSubmit(e, listData.id, { title: listEdit })
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
								<PopoverContent
									className='w-fit p-0'
									align={'center'}
									collisionPadding={{ top: 10, right: 10, left: 10 }}>
									<MyEmojiPicker onEmojiSelect={onEmojiSelect} />
									<PopoverArrow className='fill-amber-500' />
								</PopoverContent>
							</Popover>
							<input
								id='listName'
								name='title'
								type='text'
								ref={inputTitle}
								value={listEdit}
								placeholder='Name this list'
								className='h-10 min-w-0 flex-1 rounded-xl bg-gray-300 p-4 text-gray-900 placeholder:text-gray-400 focus-within:outline focus-within:outline-2 focus-within:outline-violet-500'
								onChange={(event) => {
									setListEdit(event.target.value);
								}}
								onFocus={(e) => {
									if (inputTitleCount.current instanceof HTMLDivElement) {
										inputTitleCount.current.style.display = 'block';
									}
								}}
								onBlur={(e) => {
									(inputTitleCount.current as HTMLDivElement).style.display =
										'none';
								}}
								disabled={status === 'submitting'}
								autoFocus
								maxLength={75}
								required
							/>
						</div>
						<div
							id='listTitleCount'
							ref={inputTitleCount}
							className={`absolute bottom-0 right-6 text-xs ${
								listEdit.length < 38 ? 'text-gray-400' : 'text-amber-500'
							}`}>
							<span id='current'>{listEdit.length}</span>
							<span id='maximum'>/75</span>
						</div>
					</div>
					<div className='m-4 mt-1 flex items-center justify-between'>
						<div className='flex justify-end'>
							<DeleteModalList
								deleteFunction={deleteFunction}
								deleteEntity='list'
								id={listData.id}
								size={1.4}
							/>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<a
											className='ml-4 mr-4 flex items-center text-violet-500 hover:cursor-pointer hover:text-violet-600'
											onClick={(e) => {
												archiveHandleSubmit(e)
													.then(() => {})
													.catch(() => {});
											}}>
											{listData.archived ? (
												<UnArchive size={'1.4em'} />
											) : (
												<Archive size={'1.4em'} />
											)}
										</a>
									</TooltipTrigger>
									<TooltipContent className='bg-violet-500'>
										<p className='font-bold text-white'>
											{listData.archived ? 'Restore ' : 'Archive '} List
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						<button
							type='submit'
							className='flex h-9 w-fit items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 focus-visible:ring focus-visible:ring-cyan-300 disabled:bg-cyan-200'
							disabled={!!(status === 'submitting' || listEdit.length === 0)}>
							<span
								className={`loader ${
									status === 'submitting' ? 'block' : 'invisible'
								}`}></span>
							<span className={status === 'submitting' ? 'invisible' : 'block'}>
								Save
							</span>
						</button>
						<PopoverClose
							className='absolute right-2 top-2 text-gray-400 hover:text-gray-500'
							aria-label='Close'>
							<CloseSquare size='1.6rem' />
						</PopoverClose>
					</div>
				</form>
				<PopoverArrow className='fill-sky-500' />
			</PopoverContent>
		</Popover>
	);
}
