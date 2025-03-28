import React from 'react';

import { clientTodo } from '../../lib/api';

import type { TaskListProps } from '../../lib/customTypes';
import TaskItem from './taskitem';

/*Drag and drop imports*/
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	MouseSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import SortableTaskItem from './sortableTaskItem';

export default function TaskList({
	todos,
	lists,
	userInfo,
	setTodos,
	toggleTodo,
	deleteTodo,
	editTodo,
	editTodoFull,
	isComplete,
}: TaskListProps): React.JSX.Element {
	/* Drag and drop definitions */
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
		/*useSensor(MouseSensor, {
				activationConstraint: {distance: 5}
			}),*/
	);

	async function handleDragEnd(event: any) {
		const { active, over } = event;

		if (active.id !== over.id) {
			//Find index of item being dragged (active) and index of item being dragged over (over)
			const oldIndex = todos.findIndex((i) => i.id == active.id);
			const newIndex = todos.findIndex((i) => i.id == over.id);
		
			/*
			//Move items in the array
			const newTodos = arrayMove(todos, oldIndex, newIndex);
			//Store index in list of final destination of dragged item
			const tmpIndex = todos[newIndex].index;

			// Update active and over lists 
			let tmpTodos: { id: number; index: number }[] = [];
			//  Update indexes of lists between active and over items 
			if (newIndex < oldIndex) {
				for (let i = newIndex; i < oldIndex; i++) {
					tmpTodos.push({
						id: lists[i].id as number,
						index: (todos[i].index as number) + 1,
					});
					newTodos[i + 1].index = (newTodos[i + 1].index as number) + 1;
				}
				tmpTodos.push({
					id: todos[oldIndex].id as number,
					index: tmpIndex as number,
				});
			} else if (newIndex > oldIndex) {
				for (let i = newIndex; i > oldIndex; i--) {
					tmpTodos.push({
						id: todos[i].id as number,
						index: (todos[i].index as number) - 1,
					});
					newTodos[i - 1].index = (newTodos[i - 1].index as number) - 1;
				}
			}
			tmpTodos.push({
				id: todos[oldIndex].id as number,
				index: tmpIndex as number,
			});
			newTodos[newIndex].index = tmpIndex;

			// Update indexes of items between over and active list indexes in database
			tmpTodos.map(async (todo) => {
				try {
					await clientTodo.todosPartialUpdate({
						id: todo.id as number,
						patchedTodo: { index: todo.index },
					});

					console.log('Todo was patched!');
				} catch (error) {
					console.log('There was an error updating the field in Todo');
					throw error;
				}
			});

			// Update state with new todos order
			setTodos(() => [...newTodos]);*/
		}
	}

	const taskList = todos.map((todo, idx: number) => {
		return (
			<li key={todo.id} id={`item-${todo.id}`}>
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
	});

	return (
		<div className={`content mb-3 ${isComplete ? '' : 'is-open'}`}>
			{todos.length === 0 ? (
				<div className='inner'>
					<div
						className={`text-md flex-1 px-6 ${
							isComplete ? 'pt-6' : 'py-6'
						} font-bold text-violet-600`}>
						No todos {isComplete ? 'completed yet' : 'at the moment'}
					</div>
				</div>
			) : (
				<ul className='inner divide-gray-150 divide-y'>
					{!isComplete && (
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}>
							<SortableContext
								items={todos.map((todo) => todo.id as number)}
								strategy={verticalListSortingStrategy}>
								{todos.map((todo, idx: number) => {
									return (
										<li key={todo.id} id={`item-${todo.id}`}>
											<SortableTaskItem
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
							</SortableContext>
						</DndContext>
					)}
					{isComplete &&
						taskList}
				</ul>
			)}
		</div>
	);
}
