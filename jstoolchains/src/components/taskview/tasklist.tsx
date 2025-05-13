import React, { useEffect, useState } from 'react';

import type { TaskListProps } from '../../lib/customTypes';
import TaskItem from './taskitem';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '../ui/select';

/*Drag and drop imports*/
import {
	DndContext,
	closestCenter,
	MouseSensor,
	useSensor,
	useSensors,
	DragOverlay // Import DragOverlay
} from '@dnd-kit/core';

import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy
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
	isComplete
}: TaskListProps): React.JSX.Element {
	const [sortType, setSortType] = useState<'custom' | 'dueDate'>('custom');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
	const [internalTodos, setInternalTodos] = useState<Todo[]>(todos);
	const [draggingItemId, setDraggingItemId] = useState<number | null>(null); // State to track the ID of the item being dragged
	const [activeTodo, setActiveTodo] = useState<Todo | null>(null); // State to hold the full data of the dragged item

	useEffect(() => {
		let sortedTodos = [...todos];

		if (sortType === 'dueDate') {
			sortedTodos.sort((a, b) => {
				const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
				const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

				if (sortDirection === 'asc') {
					return dateA - dateB;
				} else {
					return dateB - dateA;
				}
			});
		}
		// If sortType is 'custom', the order is already in the 'todos' prop due to order defined in parent component (taskview)
		// and drag-and-drop updates.
		setInternalTodos(sortedTodos);
	}, [todos, sortType, sortDirection]);

	/* Drag and drop definitions */
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: { distance: 5 }
		})
	);

	async function handleDragEnd(event: any) {
		const { active, over } = event;

		if (active.id !== over.id) {
			//Find index of item being dragged (active) and index of item being dragged over (over)
			const oldIndex = internalTodos.findIndex((i) => i.id == active.id);
			const newIndex = internalTodos.findIndex((i) => i.id == over.id);

			//Move items in the array
			if (oldIndex !== -1 && newIndex !== -1) {
				const newTodos = arrayMove(internalTodos, oldIndex, newIndex);

				// Optimistic update of state
				setInternalTodos(newTodos);
				// Update state with new todos order in database, in case it fails restore previous state
				editListHandler(currentView.id, {
					ordering: { order: newTodos.map((todo) => todo.id) as number[] }
				})
					.then(() => {})
					.catch(() => {
						// Optional: Revert state or show error toast if API fails
						toast({
							title: 'Error',
							description: 'Failed to reorder tasks. Please try again.',
							variant: 'destructive'
						});
						// Revert state on failure
						setInternalTodos(internalTodos);
					});
			}
		}
		setDraggingItemId(null); // Reset dragging state on end
		setActiveTodo(null); // Clear the active todo data
		document.body.style.cursor = ''; // Reset body cursor on end
	}

	function handleDragStart(event: any) {
		const activeId = event.active.id as number;
		setDraggingItemId(activeId); // Set dragging state on start
		// Find the full todo object and store it
		setActiveTodo(internalTodos.find((todo) => todo.id === activeId) || null);
		document.body.style.cursor = 'grabbing'; // Set body cursor to grabbing on start
	}

	// Disable D&D when sorting by due date
	const isDragAndDropEnabled = sortType === 'custom';

	return (
		<div className={`content mb-3 ${isComplete ? '' : 'is-open'}`}>
			{/* Sorting Controls */}
			{!isComplete && (
				<div className='flex items-center space-x-2 px-6 py-3'>
					<Select
						value={sortType}
						onValueChange={(value: 'custom' | 'dueDate') => {
							setSortType(value);
							// If switching to due date, reset direction to ascending
							if (value === 'dueDate') {
								setSortDirection('asc');
							}
						}}>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='Sort By' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='custom'>Custom Order</SelectItem>
							<SelectItem value='dueDate'>Due Date</SelectItem>
						</SelectContent>
					</Select>

					{sortType === 'dueDate' && (
						<Select
							value={sortDirection}
							onValueChange={(value: 'asc' | 'desc') =>
								setSortDirection(value)
							}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Sort Direction' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='asc'>Ascending</SelectItem>
								<SelectItem value='desc'>Descending</SelectItem>
							</SelectContent>
						</Select>
					)}
				</div>
			)}

			{internalTodos.length === 0 ? (
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
					{!isComplete && internalTodos && (
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragStart={handleDragStart} // Add onDragStart handler
							onDragEnd={handleDragEnd}>
							<SortableContext
								items={internalTodos.map((todo) => todo.id as number)}
								strategy={verticalListSortingStrategy}>
								{internalTodos.map((todo, idx: number) => (
									<li key={todo.id} id={`item-${todo.id}`}>
										<SortableTaskItem
											todo={todo}
											lists={lists}
											userInfo={userInfo}
											toggleTodo={toggleTodo}
											editTodo={editTodo}
											editTodoFull={editTodoFull}
											deleteTodo={deleteTodo}
											draggingItemId={draggingItemId}
											isOverlayItem={false}
											isDragAndDropEnabled={isDragAndDropEnabled}
										/>
									</li>
								))}
							</SortableContext>
							{/* DragOverlay renders the item being dragged */}
							<DragOverlay>
								{activeTodo ? (
									<SortableTaskItem
										todo={activeTodo}
										lists={lists}
										userInfo={userInfo}
										toggleTodo={toggleTodo}
										editTodo={editTodo}
										editTodoFull={editTodoFull}
										deleteTodo={deleteTodo}
										draggingItemId={draggingItemId}
										isOverlayItem={true}
										isDragAndDropEnabled={isDragAndDropEnabled}
									/>
								) : null}
							</DragOverlay>
						</DndContext>
					)}
					{isComplete &&
						internalTodos.map((todo, idx: number) => {
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
