import React from 'react';

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
	toggleTodo,
	deleteTodo,
	editTodo,
	editTodoFull,
	isComplete,
}: TaskListProps): React.JSX.Element {
	/* TODO Part two of implementation, add drag and drop functionality, import libraries, add sensors etc. Follow instructions from Claude 3.5*/
	/* Drag and drop definitions */
		const sensors = useSensors(
			useSensor(PointerSensor),
			useSensor(KeyboardSensor, {
			  coordinateGetter: sortableKeyboardCoordinates,
			})
			/*useSensor(MouseSensor, {
				activationConstraint: {distance: 5}
			}),*/
		  );
		
		  async function handleDragEnd(event: any) {
			const {active, over} = event;
			
			if (active.id !== over.id) {
		
				const oldIndex = lists.findIndex(i => i.id==active.id);
				const newIndex = lists.findIndex(i => i.id==over.id);
	
				const newLists = arrayMove(lists, oldIndex, newIndex);
				const tmpIndex = lists[newIndex].index;
				
				/* Update active and over lists */
				let tmpLists: {id:number; index:number;}[] = [];
				if (newIndex < oldIndex) {
					for (let i = newIndex; i < oldIndex; i++) {
						tmpLists.push({id:lists[i].id as number, index: (lists[i].index as number)+1 });
						newLists[i+1].index = (newLists[i+1].index as number)+1;
					}
					tmpLists.push({id:lists[oldIndex].id as number, index: tmpIndex as number });
					
				}else if (newIndex > oldIndex) {
					for (let i = newIndex; i > oldIndex; i--) {
						tmpLists.push({id:lists[i].id as number, index: (lists[i].index as number)-1 });
						newLists[i-1].index = (newLists[i-1].index as number)-1;
					}
					
				}
				tmpLists.push({id:lists[oldIndex].id as number, index: tmpIndex as number });
				newLists[newIndex].index = tmpIndex;
	
				tmpLists.map(async list => {
				try {
							await clientList.listsPartialUpdate({
								id: list.id as number,
								patchedList:{ index: list.index }}
							);
	
							console.log('List was patched!');
							
						} catch (error) {
							console.log('There was an error updating the field in List');
							throw error;
						}
					});
			
				dispatchLists({ type: 'changed', payload: newLists });
			}
		  }
	


	const taskList = todos.map((todo, idx: number) => {
		return (
			<li key={todo.id} id={`item-${todo.id}`}>
				<TaskItem
					todo={todo}
					lists={lists}
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
				<ul className='inner divide-gray-150 divide-y'>{taskList}</ul>
			)}
		</div>
	);
}
