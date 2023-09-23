import React, { useState, type CSSProperties } from 'react';

import { type EditModalListProps } from '../../lib/customTypes';
import { Edit } from 'iconsax-react';

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

import Spinner from 'react-spinners/DotLoader';

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
}: EditModalListProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [listEdit, setListEdit] = useState('');
	const [status, setStatus] = useState('typing');
	const [error, setError] = useState<string | null>(null);

	const editHandleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
		id: number,
	): Promise<void> => {
		event.preventDefault();
		if (listEdit === '') return;
		setStatus('submitting');
		try {
			const updatedList = await editList(id, listEdit);
			console.log('Patched list: ', updatedList);
			closePopover();
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			}
			setStatus('typing');
		}
	};

	const closePopover = (): void => {
		setIsOpen(false);
	};
	const openPopover = (): void => {
		toggleHidden();
		setListEdit(listData.title);
		setStatus('typing');
		setError(null);
		setIsOpen(true);
	};

	const toggleHidden = (): void => {
		(document.getElementById(parentId) as HTMLElement).classList.toggle(
			'hidden-child',
		);
	};
	console.log('Modal edit list rendered', isOpen, listEdit, status, error);
	return (
		<Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
			<TooltipProvider>
				<Tooltip>
					<PopoverTrigger
						asChild={true}
						className='flex cursor-pointer justify-end pl-2 pr-2 text-2xl text-cyan-500 hover:text-cyan-600'
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
				className='data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='listform'
					className='font-serif flex flex-col'
					onSubmit={(e) => {
						editHandleSubmit(e, listData.id)
							.then(() => {})
							.catch(() => {});
					}}>
					<input
						id='listName'
						name='title'
						type='text'
						value={listEdit}
						placeholder='Name this list'
						className='m-4 h-8 rounded-xl bg-gray-300 p-2 px-4 py-3 text-gray-900 placeholder:text-gray-500'
						onChange={(event) => {
							setListEdit(event.target.value);
						}}
						disabled={status === 'submitting'}
						autoFocus
						required
					/>
					<div className='mb-4 ml-4 mr-4 flex items-center justify-between'>
						<button
							type='submit'
							className='flex h-10 w-2/5 items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 focus-visible:ring focus-visible:ring-cyan-300 disabled:bg-cyan-200'
							disabled={!!(status === 'submitting' || listEdit.length === 0)}>
							<Spinner
								color='rgb(147 51 234)'
								loading={status === 'submitting'}
								cssOverride={override}
								size={20}
								aria-label='Loading Spinner'
								data-testid='loader'
							/>
							<span className={status === 'submitting' ? 'invisible' : 'block'}>
								Edit
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
						<div className='text-sm font-bold text-red-500'>
							There was an error editing list: {error}
						</div>
					)}
				</form>
				<PopoverArrow className='fill-sky-500' />
			</PopoverContent>
		</Popover>
	);
}
