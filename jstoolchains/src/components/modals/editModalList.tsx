import React, { useState, useRef, useEffect, type CSSProperties } from 'react';

import { type EditModalListProps } from '../../lib/customTypes';
import { SquareX, Edit } from 'lucide-react';

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

import DeleteModalList from './deleteModalList';
import ArchiveModalList from './archiveModalList';

export default function EditModalList({
	editList,
	listData,
	parentId,
	deleteFunction,
}: EditModalListProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [listEdit, setListEdit] = useState<string>('');
	const [status, setStatus] = useState('typing');
	const inputTitle = useRef<HTMLInputElement>(null);
	const inputTitleCount = useRef<HTMLDivElement>(null);
	const { toast } = useToast();

	useEffect(() => {
		if (status === 'typing') {
			if (inputTitle.current !== null) {
				inputTitle.current.focus();
			}
		}
	}, [status]);

	const editHandleSubmit = async (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,

		id: number,
		tmpList: { title?: string; archived?: boolean },
	): Promise<void> => {
		event.preventDefault();
		if (tmpList.title === '') return;
		setStatus('submitting');

		try {
			const updatedList = await editList(id, tmpList);
			console.log('Updated list: ', updatedList);
			toast({
				title: 'List was updated!',
				description: '',
			});
			closePopover();
		} catch (error) {
			if (error instanceof Error) {
				toast({
					variant: 'destructive',
					title: 'There was an error updating the list: ',
					description: error.message,
				});
			}
			setStatus('typing');
		}
	};

	const closePopover = (): void => {
		setIsOpen(false);
	};
	const openPopover = (): void => {
		removeHidden();
		setListEdit(listData.title);
		setStatus('typing');
		setIsOpen(true);
	};

	const removeHidden = (): void => {
		(document.getElementById(parentId) as HTMLElement).classList.remove(
			'hidden-child',
		);
	};
	const addHidden = (): void => {
		(document.getElementById(parentId) as HTMLElement).classList.add(
			'hidden-child',
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
							<Edit size={'1.4rem'} strokeWidth={'1.5px'} />
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className='bg-sky-500'>
						<p className='font-bold text-white'>Edit</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent
				align={'center'}
				onOpenAutoFocus={(event) => {}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
					addHidden();
				}}
				className='w-80 data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form id='listform' className='flex flex-col'>
					<div className='relative flex flex-1 flex-col'>
						<input
							id='listName'
							name='title'
							type='text'
							ref={inputTitle}
							value={listEdit}
							placeholder='Name this list'
							className='m-4 h-10 rounded-xl bg-gray-300 p-4 text-gray-900 placeholder:text-gray-500 focus-within:outline focus-within:outline-2 focus-within:outline-violet-500'
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
						<div
							id='listTitleCount'
							ref={inputTitleCount}
							className={`absolute bottom-0 right-6 text-[10px] ${
								listEdit.length < 38 ? 'text-gray-400' : 'text-amber-500'
							}`}>
							<span id='current'>{listEdit.length}</span>
							<span id='maximum'>/75</span>
						</div>
					</div>
					<div className='mb-4 ml-4 mr-4 mt-1 flex items-center justify-between'>
						<div className='flex justify-end'>
							<DeleteModalList
								deleteFunction={deleteFunction}
								deleteEntity='list'
								id={listData.id}
								size={1.4}
							/>
							<ArchiveModalList editFunction={editList} listData={listData} />
						</div>
						<button
							type='submit'
							className='flex h-9 w-fit items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 focus-visible:ring focus-visible:ring-cyan-300 disabled:bg-cyan-200'
							disabled={!!(status === 'submitting' || listEdit.length === 0)}
							onClick={(e) => {
								editHandleSubmit(e, listData.id, { title: listEdit })
									.then(() => {})
									.catch(() => {});
							}}>
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
							<SquareX strokeWidth={'1.5px'} />
						</PopoverClose>
					</div>
				</form>
				<PopoverArrow className='fill-sky-500' />
			</PopoverContent>
		</Popover>
	);
}
