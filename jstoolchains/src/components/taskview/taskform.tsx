import React, { useState, useRef, type CSSProperties } from 'react';

import { useToast } from '../ui/toast/use-toast';

import Spinner from 'react-spinners/DotLoader';

import type { TaskFormProps, todoType } from '../../lib/customTypes';
import { flushSync } from 'react-dom';

const override: CSSProperties = {
	display: 'block',
	position: 'absolute',
	justifyContent: 'center',
	alignSelf: 'center',
};

export default function TaskForm({
	addTodo,
}: TaskFormProps): React.JSX.Element {
	const [newTodo, setNewTodo] = useState<todoType>({
		title: '',
		description: '',
	});
	const [status, setStatus] = useState('typing');
	const inputRef = useRef<HTMLInputElement>(null);
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
					description: '',
				});
			})
			.catch((error) => {
				if (error instanceof Error) {
					toast({
						variant: 'destructive',
						title: 'There was an error creating the task: ',
						description: error.message,
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
			className='font-serif mb-6 flex space-x-4 text-lg'
			onSubmit={handleSubmit}>
			<input
				type='text'
				name='title'
				className='h-10 flex-1 rounded-xl bg-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500'
				id='todoText'
				value={newTodo.title}
				onChange={(e) => {
					setNewTodo((old) => ({ ...old, title: e.target.value }));
				}}
				onFocus={(e) => {
					e.target.setSelectionRange(
						e.target.value.length,
						e.target.value.length,
					);
				}}
				placeholder='Enter your todo here'
				ref={inputRef}
				disabled={status === 'submitting'}
				required
			/>
			<button
				type='submit'
				className='flex h-10 items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-black hover:bg-cyan-600 focus-visible:ring focus-visible:ring-cyan-300 disabled:bg-cyan-100'
				disabled={!!(newTodo.title.length === 0 || status === 'submitting')}>
				<Spinner
					color='rgb(8 145 178)'
					loading={status === 'submitting'}
					cssOverride={override}
					size={20}
					aria-label='Loading Spinner'
					data-testid='loader'
				/>
				<span className={status === 'submitting' ? 'invisible' : 'block'}>
					Add
				</span>
			</button>
		</form>
	);
}
