import React, { useState, useRef, useEffect, type CSSProperties } from 'react';

import { type EditModalListProps } from '../../lib/customTypes';
import { ArchiveBox, CloseSquare, Edit } from 'iconsax-react';

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
import DeleteModalList from './deleteModalList';
import { flushSync } from 'react-dom';

const override: CSSProperties = {
	display: 'block',
	position: 'absolute',
	justifyContent: 'center',
	alignSelf: 'center',
};

export default function EditModalList({
	editList,
	listData,
	parentId,
	deleteFunction,
}: EditModalListProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [listEdit, setListEdit] = useState<{
		title: string;
		archived: null | boolean;
	}>({ title: '', archived: null });
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
		event:
			| React.FormEvent<HTMLFormElement>
			| React.MouseEvent<HTMLDivElement, MouseEvent>,

		id: number,
		listEdit: { title: string; archived: null | boolean },
	): Promise<void> => {
		event.preventDefault();
		if (listEdit.title === '') return;
		setStatus('submitting');

		try {
			const updatedList = await editList(id, listEdit);
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
		toggleHidden();
		setListEdit({ title: listData.title, archived: null });
		setStatus('typing');
		setIsOpen(true);
	};

	const toggleHidden = (): void => {
		(document.getElementById(parentId) as HTMLElement).classList.toggle(
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
							<Edit size={'1.4rem'} />
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
					toggleHidden();
				}}
				className='w-80 data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='listform'
					className='flex flex-col'
					onSubmit={(e) => {
						editHandleSubmit(e, listData.id, listEdit)
							.then(() => {})
							.catch(() => {});
					}}>
					<div className='relative flex flex-1 flex-col'>
						<input
							id='listName'
							name='title'
							type='text'
							ref={inputTitle}
							value={listEdit.title}
							placeholder='Name this list'
							className='m-4 h-10 rounded-xl bg-gray-300 p-4 text-gray-900 placeholder:text-gray-500'
							onChange={(event) => {
								setListEdit({ ...listEdit, title: event.target.value });
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
								listEdit.title.length < 38 ? 'text-gray-400' : 'text-amber-500'
							}`}>
							<span id='current'>{listEdit.title.length}</span>
							<span id='maximum'>/75</span>
						</div>
					</div>
					<div className='mb-4 ml-4 mr-4 mt-1 flex items-center justify-between'>
						<div className='flex justify-end'>
							<DeleteModalList
								deleteFunction={deleteFunction}
								deleteEntity='list'
								id={listData.id}
								size={1.6}
							/>
							<div
								className=' ml-4 mr-4 flex items-center text-violet-500 hover:cursor-pointer hover:text-violet-600'
								onClick={(e) => {
									editHandleSubmit(e, listData.id, {
										...listEdit,
										archived: true,
									})
										.then(() => {})
										.catch(() => {});
								}}>
								<ArchiveBox />
							</div>
						</div>
						<button
							type='submit'
							className='flex h-9 w-fit items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 focus-visible:ring focus-visible:ring-cyan-300 disabled:bg-cyan-200'
							disabled={
								!!(status === 'submitting' || listEdit.title.length === 0)
							}>
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
						<PopoverClose
							className='absolute right-2 top-2 text-gray-400 hover:text-gray-500'
							aria-label='Close'>
							<CloseSquare />
						</PopoverClose>
					</div>
				</form>
				<PopoverArrow className='fill-sky-500' />
			</PopoverContent>
		</Popover>
	);
}
