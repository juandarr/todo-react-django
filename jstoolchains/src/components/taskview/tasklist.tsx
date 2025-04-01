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
	editList,
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

	const editListHandler = async (
				id: number,
				tmpList: { title?: string; ordering?:{order: number[]};archived?: boolean },
			): Promise<void> => {
				
				if (tmpList.ordering?.order?.length === 0) return;
		
				try {
					const updatedList = await editList(id, tmpList);
					console.log('Updated ordering of list: ', updatedList);
					toast({
						title: 'List ordering was updated!',
						description: '',
					});
				} catch (error) {
					if (error instanceof Error) {
						toast({
							variant: 'destructive',
							title: 'There was an error updating the list ordering: ',
							description: error.message,
						});
					}
				}
			};

	const todosOrdered = useMemo(() => {

		if (!isComplete){
			
			const currentList = lists.filter((list) => (list.id === currentView.id))
			if (currentList.length !== 0){
				console.log('This is the current list: ',currentList);
				console.log('And here is the ordering: ',currentList[0].ordering, currentList[0].ordering?.order.length === 0);
				const tmp = todos.map((todo) => todo.id) as number[];
				if (currentList[0].ordering?.order.length === 0) {
					
					console.log('Order of todos: ' ,tmp);
					//Store initial order of todos. Implement such operation here
					editListHandler(currentView.id, { ordering: {order: tmp } })
										.then(() => {})
										.catch(() => {});
				} else {
					//If order is already defined, check existence of todos. Remove the ones not present from ordering array, add new ones to the end, store new ordering array, this is next
					//compare current list to sorted one, new todos won´t be on sorted, add to the end
					const order = [...currentList[0].ordering?.order];
					const toRemove = [];
					const toAdd = [];
					let change = false;
					for (let i =0; i< order.length; i++){
						if (!(tmp.includes(order[i]))){
							toRemove.push(order[i]);
							change =true;
	
						}
					}
					for (let i=0; i<tmp.length; i++){
						if (!(order.includes(tmp[i]))){
							toAdd.push(tmp[i]);
							change = true;
						}
					}
					console.log('Current list: ', tmp, ' And order: ', order);
					// Remove values
					let idx;
					for (let i = 0; i < toRemove.length; i++){
						idx = order.indexOf(toRemove[i]);
						order.splice(idx,1);
					}
					// Add values
					console.log('Here is what is going to be added: ', toAdd, ' and removed: ', toRemove);
					order.push(...toAdd);
					console.log('The value of change is: ', change);
					if (change) {
						console.log('New order: ', order);
						editListHandler(currentView.id, { ordering: {order: order } })
										.then(() => {})
										.catch(() => {});
					}
					return order.map((id) => todos.find((todo) => todo.id===id)) as Todo[];
				}
			}}

			return todos;
		}, [todos]);

	const taskList = todosOrdered.map((todo, idx: number) => {
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
								{todosOrdered.map((todo, idx: number) => {
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
