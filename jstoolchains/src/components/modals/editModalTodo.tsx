import React, { useState, type CSSProperties } from 'react';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';

import { Edit } from 'iconsax-react';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	PopoverArrow,
	PopoverClose,
} from '../ui/popover';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';

import Spinner from 'react-spinners/DotLoader';

import type { EditModalTodoProps, todoType } from '../../lib/customTypes';
import { PriorityEnum } from '../../lib/userSettings';

const override: CSSProperties = {
	display: 'block',
	position: 'absolute',
	justifyContent: 'center',
	alignSelf: 'center',
};

export default function EditModalTodo({
	editTodoFull,
	todo,
	lists,
	parentId,
}: EditModalTodoProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [newEditTodo, setNewEditTodo] = useState<todoType>({
		title: '',
		description: '',
	});
	const [status, setStatus] = useState('typing');
	const [error, setError] = useState<any>(null);

	const editHandleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		event.preventDefault();
		if (newEditTodo.title === '') return;
		setStatus('submitting');

		try {
			await editTodoFull(newEditTodo);
			closePopover();
		} catch (error) {
			setError(error);
			setStatus('typing');
		}
	};

	const closePopover = (): void => {
		setIsOpen(false);
	};

	const openPopover = (): void => {
		toggleHidden();
		const tmpTodo: todoType = {
			...todo,
			list: todo.list?.toString(),
			priority: todo.priority?.toString(),
		};
		setNewEditTodo(tmpTodo);
		setStatus('typing');
		setError(null);
		setIsOpen(true);
	};
	const toggleHidden = (): void => {
		const el: HTMLElement = document.getElementById(parentId) as HTMLElement;
		if (el !== null) el.classList.toggle('hidden-child');
	};
	console.log('Modal todo edition opened');
	return (
		<Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
			<TooltipProvider>
				<Tooltip>
					<PopoverTrigger
						asChild={true}
						onClick={(event) => {
							openPopover();
						}}>
						<TooltipTrigger asChild={true}>
							<a className='flex cursor-pointer justify-end text-2xl text-sky-500 hover:text-sky-600 mr-2'>
								<Edit size={'1.8rem'} />
							</a>
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className='bg-sky-500'>
						<p className='font-bold text-white'>Edit todo</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent
				align={'center'}
				onOpenAutoFocus={() => {}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
					toggleHidden();
				}}
				className='data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='listform'
					className='font-serif flex flex-col'
					onSubmit={(e) => {
						editHandleSubmit(e)
							.then(() => {})
							.catch(() => {});
					}}>
					<input
						id='todoTitle'
						name='title'
						type='text'
						value={newEditTodo.title}
						placeholder='Name this todo'
						className='mb-2 ml-4 mr-4 mt-4 h-8 rounded-xl bg-gray-300 p-2 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500'
						onChange={(event) => {
							setNewEditTodo((old) => ({ ...old, title: event.target.value }));
						}}
						disabled={status === 'submitting'}
						autoFocus
						required
					/>
					<textarea
						id='todoDescription'
						name='description'
						value={newEditTodo.description}
						placeholder='Description'
						className='mb-1 ml-4 mr-4 mt-1 h-28 rounded-xl bg-gray-300 p-2 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500'
						onChange={(event) => {
							setNewEditTodo((old) => ({
								...old,
								description: event.target.value,
							}));
						}}
						disabled={status === 'submitting'}
					/>
					<div className='mb-3 ml-4 mr-4 mt-2 flex items-center justify-start'>
						<Select
							value={newEditTodo.priority}
							onValueChange={(value) => {
								setNewEditTodo((old) => ({ ...old, priority: value }));
							}}
							disabled={status === 'submitting'}>
							<SelectTrigger className='mr-3 h-2 w-5/12 p-3 '>
								<SelectValue placeholder='Priority' />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(PriorityEnum).map((item, idx) => {
									return (
										<SelectItem key={idx} value={item[1]}>
											{item[0]}
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
						<Select
							value={newEditTodo.list}
							onValueChange={(value) => {
								setNewEditTodo((old) => ({ ...old, list: value }));
							}}
							disabled={status === 'submitting'}>
							<SelectTrigger className='h-2 w-full p-3'>
								<SelectValue placeholder='List' />
							</SelectTrigger>
							<SelectContent>
								{lists.map((list) => (
									<SelectItem
										key={list.id}
										value={(list.id as number).toString()}>
										{list.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='mb-4 ml-4 mr-4 flex items-center justify-between'>
						<button
							type='submit'
							className='flex h-10 w-2/5 items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 disabled:bg-cyan-200 focus-visible:ring focus-visible:ring-cyan-300'
							disabled={
								!!(status === 'submitting' || newEditTodo.title.length === 0)
							}>
							<Spinner
								color='rgb(8 145 178)'
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
								className='flex h-10 w-2/5 items-center justify-center rounded-xl border-2 border-black bg-rose-500 p-3 text-lg text-black hover:bg-rose-600 disabled:bg-rose-200 focus-visible:ring focus-visible:ring-rose-300'
								disabled={status === 'submitting'}>
								Cancel
							</button>
						</PopoverClose>
					</div>
					{error != null && (
						<div className='text-sm font-bold text-red-500'>
							There was an error updating task: {error}
						</div>
					)}
				</form>
				<PopoverArrow className='fill-sky-500' />
			</PopoverContent>
		</Popover>
	);
}
