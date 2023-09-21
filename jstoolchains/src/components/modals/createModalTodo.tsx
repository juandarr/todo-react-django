import React, { useState, useRef, type CSSProperties, useEffect } from 'react';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';

import { AddCircle } from 'iconsax-react';

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

import type { CreateModalTodoProps, todoType } from '../../lib/customTypes';
import { PriorityEnum } from '../../lib/userSettings';
import { isDescendantOf } from '../../lib/utils';
import useAutosizeTextArea from '../../lib/useAutosizeTextArea';

const override: CSSProperties = {
	display: 'block',
	position: 'absolute',
	justifyContent: 'center',
	alignSelf: 'center',
};

export default function CreateModalTodo({
	lists,
	addTodo,
}: CreateModalTodoProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [newTodo, setNewTodo] = useState<todoType>({
		title: '',
		description: '',
		priority: '4',
	});
	const [status, setStatus] = useState('typing');
	const [error, setError] = useState(null);

	const textAreaTitle = useRef<HTMLTextAreaElement>(null);
	const textAreaDescription = useRef<HTMLTextAreaElement>(null);

	useAutosizeTextArea(textAreaTitle.current, newTodo.title);
	useAutosizeTextArea(
		textAreaDescription.current,
		newTodo.description as string,
	);

	const call = (event: any): void => {
		console.log(event.target.parentNode.nodeName);
		if (!isDescendantOf(event.target, 'form')) {
			if (event.key === 'q' && !isOpen) {
				event.preventDefault();
				openPopover();
			}
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', call);
		return () => {
			document.removeEventListener('keydown', call);
		};
	}, [call]);

	useEffect(() => {
		if (status === 'typing') {
			// waitForElementToExist('#todoTitle')
			// 	.then((element) => {
			// 		const el = document.getElementById('todoTitle');
			// 		el?.focus();
			// 		console.log('Now focues on field');
			// 	})
			// 	.catch(() => {});
			if (textAreaTitle.current !== null) {
				textAreaTitle.current.focus();
			}
		}
	}, [status]);

	const createHandleSubmit = async (): Promise<void> => {
		if (newTodo.title === '') return;
		setStatus('submitting');

		try {
			await addTodo(newTodo, 'NavBar');
			setNewTodo({ title: '', description: '', priority: '4' });
			setStatus('typing');
			setError(null);
			// closePopover();
		} catch (error) {
			setError(error);
			setStatus('typing');
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
			// Submit the form when Ctrl (Windows/Linux) or Command (Mac) + Enter is pressed
			createHandleSubmit()
				.then(() => {})
				.catch(() => {});
		}
	};

	// const closePopover = (): void => {
	// 	setIsOpen(false);
	// };

	const openPopover = (): void => {
		setNewTodo({ title: '', description: '' });
		setStatus('typing');
		setError(null);
		setIsOpen(true);
	};
	console.log('Modal todo creation opened');
	return (
		<Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
			<TooltipProvider>
				<Tooltip>
					<PopoverTrigger asChild={true}>
						<TooltipTrigger asChild={true}>
							<button className='text-emerald-400 hover:text-emerald-500'>
								<AddCircle
									size='1.8rem'
									className='cursor-pointer'
									onClick={() => {
										openPopover();
									}}
								/>
							</button>
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className='bg-emerald-500'>
						<p className='font-bold text-white'>Add todo</p>
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
						e.preventDefault();
						createHandleSubmit()
							.then(() => {})
							.catch(() => {});
					}}>
					<textarea
						id='todoTitle'
						name='title'
						value={newTodo.title}
						ref={textAreaTitle}
						placeholder='Name this todo'
						className='mb-2 ml-4 mr-4 mt-4 rounded-lg bg-gray-300 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500'
						onChange={(event) => {
							setNewTodo((old) => ({ ...old, title: event.target.value }));
						}}
						onFocus={(e) => {
							e.target.setSelectionRange(
								e.target.value.length,
								e.target.value.length,
							);
						}}
						onKeyDown={(e) => {
							handleKeyDown(e);
						}}
						disabled={status === 'submitting'}
						rows={1}
						required
					/>
					<textarea
						id='todoDescription'
						name='description'
						value={newTodo.description}
						ref={textAreaDescription}
						placeholder='Description'
						className='mb-1 ml-4 mr-4 mt-1 rounded-lg bg-gray-300 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500'
						onChange={(event) => {
							setNewTodo((old) => ({
								...old,
								description: event.target.value,
							}));
						}}
						onFocus={(e) => {
							e.target.setSelectionRange(
								e.target.value.length,
								e.target.value.length,
							);
						}}
						onKeyDown={(e) => {
							handleKeyDown(e);
						}}
						rows={1}
						disabled={status === 'submitting'}
					/>
					<div className='mb-3 ml-4 mr-4 mt-2 flex items-center justify-between'>
						<Select
							value={newTodo.priority}
							onValueChange={(value) => {
								setNewTodo((old) => ({ ...old, priority: value }));
							}}
							disabled={status === 'submitting'}>
							<SelectTrigger
								className={`mr-3 h-2 w-6/12 p-3 ${
									newTodo.priority === '1'
										? 'bg-rose-200'
										: newTodo.priority === '2'
										? 'bg-amber-200'
										: newTodo.priority === '3'
										? 'bg-sky-200'
										: 'bg-white'
								} `}>
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
							value={newTodo.list}
							onValueChange={(value) => {
								setNewTodo((old) => ({ ...old, list: value }));
							}}
							disabled={status === 'submitting'}>
							<SelectTrigger className='h-2 w-6/12 p-3'>
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
							className='flex h-10 w-2/5 items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 focus-visible:ring focus-visible:ring-cyan-300 disabled:bg-cyan-200'
							disabled={
								!!(status === 'submitting' || newTodo.title.length === 0)
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
						<div className='text-sm font-bold text-red-500'>
							There was an error creating task: {error}
						</div>
					)}
				</form>
				<PopoverArrow className='fill-emerald-500' />
			</PopoverContent>
		</Popover>
	);
}
