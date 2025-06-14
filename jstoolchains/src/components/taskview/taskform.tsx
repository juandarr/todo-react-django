import React, { useState, useRef } from 'react';

import { useToast } from '../ui/toast/use-toast';

import type { TaskFormProps, todoType } from '../../lib/customTypes';
import { flushSync } from 'react-dom';

export default function TaskForm({
	addTodo
}: TaskFormProps): React.JSX.Element {
	const [newTodo, setNewTodo] = useState<todoType>({
		title: '',
		description: ''
	});
	const [status, setStatus] = useState('typing');
	const inputRef = useRef<HTMLInputElement>(null);
	const inputRefCount = useRef<HTMLDivElement>(null);

	const { toast } = useToast();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		if (newTodo.title === '') return;

		setStatus('submitting');

		addTodo(newTodo, 'taskList')
			.then((result) => {
				setNewTodo({ title: '', description: '' });
				toast({
					title: 'Task was created!',
					description: ''
				});
			})
			.catch((error) => {
				if (error instanceof Error) {
					toast({
						variant: 'destructive',
						title: 'There was an error creating the task: ',
						description: error.message
					});
				}
			})
			.finally(() => {
				flushSync(() => {
					setStatus('typing');
				});
				if (inputRef.current !== null) {
					inputRef.current.focus();
				}
			});
	};

	return (
		<form
			id='myform'
			className='mb-6 flex items-center space-x-4'
			onSubmit={handleSubmit}>
			<div className='text-md relative flex w-8/12 flex-col md:w-full'>
				<input
					type='text'
					name='title'
					className='mt-0 h-10 rounded-xl bg-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus-within:outline focus-within:outline-2 focus-within:outline-emerald-500'
					id='todoText'
					value={newTodo.title}
					onChange={(e) => {
						setNewTodo((old) => ({ ...old, title: e.target.value }));
					}}
					onFocus={(e) => {
						e.target.setSelectionRange(
							e.target.value.length,
							e.target.value.length
						);
						(inputRefCount.current as HTMLDivElement).style.display = 'block';
					}}
					onBlur={(e) => {
						(inputRefCount.current as HTMLDivElement).style.display = 'none';
					}}
					placeholder='What is in your mind?'
					ref={inputRef}
					disabled={status === 'submitting'}
					maxLength={100}
					required
				/>
				<div
					id='todoTextCount'
					ref={inputRefCount}
					className={`absolute -bottom-[16px] right-3 hidden text-xs ${
						newTodo.title.length < 50 ? 'text-gray-400' : 'text-amber-500'
					}`}>
					<span id='current'>{newTodo.title.length}</span>
					<span id='maximum'>/100</span>
				</div>
			</div>
			<button
				type='submit'
				className='text-md flex h-10 items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-black hover:bg-cyan-600 focus-visible:ring focus-visible:ring-cyan-300 disabled:bg-cyan-100 md:text-lg'
				disabled={!!(newTodo.title.length === 0 || status === 'submitting')}>
				<span
					className={`loader ${
						status === 'submitting' ? 'block' : 'invisible'
					}`}></span>
				<span className={status === 'submitting' ? 'invisible' : 'block'}>
					Create
				</span>
			</button>
		</form>
	);
}
