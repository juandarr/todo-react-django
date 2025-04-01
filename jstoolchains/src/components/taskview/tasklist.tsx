import React, {useMemo } from 'react';

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
import { Todo } from '../../../../todo-api-client/models/Todo';
import { toast } from '../ui/toast/use-toast';

export default function TaskList({
	todos,
	lists,
	editListHandler,
	currentView,
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
		useSensor(MouseSensor, {
				activationConstraint: {distance: 5}
			})
	);

	async function handleDragEnd(event: any) {
		const { active, over } = event;

		if (active.id !== over.id) {
			//Find index of item being dragged (active) and index of item being dragged over (over)
			const oldIndex = todos.findIndex((i) => i.id == active.id);
			const newIndex = todos.findIndex((i) => i.id == over.id);
		
			
			//Move items in the array
			const newTodos = arrayMove(todos, oldIndex, newIndex);

				// Update state with new todos order
			editListHandler(currentView.id, { ordering: {order: newTodos.map((todo) => todo.id) as number[] } })
									.then(() => {})
									.catch(() => {});
		
			setTodos(() => [...newTodos]);

		}
	};

	


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
						todos.map((todo, idx: number) => {
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
						})}
				</ul>
			)}
		</div>
	);
}
