import React, { useState, useRef, type CSSProperties, useEffect } from 'react';

import Spinner from 'react-spinners/DotLoader';

import type { TaskFormProps } from '../../lib/customTypes';

const override: CSSProperties = {
	display: 'block',
	position: 'absolute',
	justifyContent: 'center',
	alignSelf: 'center',
};
export default function TaskForm({
	addTodo,
	newTodo,
	setNewTodo,
}: TaskFormProps): React.JSX.Element {
	const [status, setStatus] = useState('typing');
	const [error, setError] = useState(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const previousStatus = useRef<string>('');

	useEffect(() => {
		if (status === 'typing' && previousStatus.current === 'submitting') {
			if (inputRef.current !== null) {
				inputRef.current.focus();
			}
		}
		previousStatus.current = status;
	}, [status]);

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		event.preventDefault();
		if (newTodo.title === '') return;
		setStatus('submitting');

		try {
			await addTodo(newTodo, 'taskList');
			setNewTodo({ title: '', description: '' });
			setStatus('typing');
			setError(null);
		} catch (error) {
			setError(error);
			setStatus('typing');
		}
	};

	return (
		<form
			id='myform'
			className='font-serif mb-6 flex space-x-4 text-lg'
			onSubmit={(e) => {
				handleSubmit(e)
					.then(() => {})
					.catch(() => {});
			}}>
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
			{error != null && (
				<div className='absolute left-40 top-2 text-sm font-bold text-red-500'>
					There was an error creating task: {error}
				</div>
			)}
		</form>
	);
}
