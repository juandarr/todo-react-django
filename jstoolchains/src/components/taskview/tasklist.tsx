import React, { useEffect, useState } from 'react';

import type { TaskListProps } from '../../lib/customTypes';
import TaskItem from './taskitem';

/*Drag and drop imports*/
import {
	DndContext,
	closestCenter,
	MouseSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';

import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import SortableTaskItem from './sortableTaskItem';
import { Todo } from '../../../../todo-api-client/models/Todo';
import { toast } from '../ui/toast/use-toast';

export default function TaskList({
	todos,
	lists,
	editListHandler,
	currentView,
	userInfo,
	toggleTodo,
	deleteTodo,
	editTodo,
	editTodoFull,
	isComplete,
}: TaskListProps): React.JSX.Element {
	const [todosList, setTodosList] = useState<Todo[]>(todos);
	const [draggingItemId, setDraggingItemId] = useState<number | null>(null); // State to track the ID of the item being dragged

	useEffect(() => {
		setTodosList(todos);
	}, [todos]);

	/* Drag and drop definitions */
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: { distance: 5 },
		}),
	);

	async function handleDragEnd(event: any) {
		const { active, over } = event;

		if (active.id !== over.id) {
			//Find index of item being dragged (active) and index of item being dragged over (over)
			const oldIndex = todosList.findIndex((i) => i.id == active.id);
			const newIndex = todosList.findIndex((i) => i.id == over.id);

			//Move items in the array
			if (oldIndex !== -1 && newIndex !== -1) {
				const newTodos = arrayMove(todosList, oldIndex, newIndex);

				// Optimistic update of state
				setTodosList(newTodos);
				// Update state with new todos order in database, in case it fails restore previous state
				editListHandler(currentView.id, {
					ordering: { order: newTodos.map((todo) => todo.id) as number[] },
				})
					.then(() => {})
					.catch(() => {
						// Optional: Revert state or show error toast if API fails
						toast({
							title: 'Error',
							description: 'Failed to reorder tasks. Please try again.',
							variant: 'destructive',
						});
						// Revert state on failure
						setTodosList(todosList);
					});
			}
		}
		setDraggingItemId(null); // Reset dragging state on end
		document.body.style.cursor = ''; // Reset body cursor on end
	}

	function handleDragStart(event: any) {
		setDraggingItemId(event.active.id as number); // Set dragging state on start
		document.body.style.cursor = 'grabbing'; // Set body cursor to grabbing on start
	}

	return (
		<div className={`content mb-3 ${isComplete ? '' : 'is-open'}`}>
			{todosList.length === 0 ? (
				<div className='inner'>
					<div
						className={`text-md flex-1 px-6 ${
							isComplete ? 'pt-6' : 'py-6'
						} font-bold text-violet-600`}>
						No todos {isComplete ? 'completed yet' : 'at the moment'}
					</div>
				</div>
			) : (
				<ul className='inner'>
					{!isComplete && todosList && (
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragStart={handleDragStart} // Add onDragStart handler
							onDragEnd={handleDragEnd}>
							<SortableContext
								items={todosList.map((todo) => todo.id as number)}
								strategy={verticalListSortingStrategy}>
								{todosList.map((todo, idx: number) => {
									return (
										<li key={todo.id} id={`item-${todo.id}`}>
											{/* Conditionally render the divider */}
											{idx > 0 && (
												<div className='mx-auto h-px w-3/4 bg-gray-100'></div>
											)}
											<SortableTaskItem
												todo={todo}
												lists={lists}
												userInfo={userInfo}
												toggleTodo={toggleTodo}
												editTodo={editTodo}
												editTodoFull={editTodoFull}
												deleteTodo={deleteTodo}
												draggingItemId={draggingItemId} // Pass dragging state down
											/>
										</li>
									);
								})}
							</SortableContext>
						</DndContext>
					)}
					{isComplete &&
						todosList.map((todo, idx: number) => {
							return (
								<li key={todo.id} id={`item-${todo.id}`}>
									{/* Conditionally render the divider */}
									{idx > 0 && (
										<div className='mx-auto h-px w-4/5 bg-gray-100'></div>
									)}
									<TaskItem
										todo={todo}
										lists={lists}
										userInfo={userInfo}
										toggleTodo={toggleTodo}
										editTodo={editTodo}
										editTodoFull={editTodoFull}
										deleteTodo={deleteTodo}
									/>
								</li>
							);
						})}
				</ul>
			)}
		</div>
	);
}
