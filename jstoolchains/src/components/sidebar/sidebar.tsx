import React, { useContext } from 'react';

import { clientList} from '../../lib/api';

import { type SideBarProps } from '../../lib/customTypes';

import CreateModalList from '../modals/createModalList';
import EditModalList from '../modals/editModalList';
import { UserContext } from '../../contexts/UserContext';
import { ArrowDown3 } from 'iconsax-react';

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
  
import SortableListItem from './sortableListItem';

export default function SideBar({
	lists,
	dispatchLists,
	viewData,
	currentView,
	changeCurrentView,
	addList,
	deleteList,
	editList,
	showSidebar,
}: SideBarProps): React.JSX.Element {
	const user = useContext(UserContext);

	const inbox = lists.find((list) => user.inboxListId === list.id);

	const ViewLists = viewData.viewTagIds.map((value) => (
		<button
			key={value}
			className={`flex cursor-pointer justify-start ${
				currentView.id === value
					? 'list-view-selected rounded-md bg-cyan-200 font-semibold'
					: ''
			} lists-views rounded-xl p-1 pl-2 text-base`}
			onClick={() => {
				changeCurrentView(value);
			}}>
			{viewData.viewTagDetails.get(value)}
		</button>
	));

	const activeLists = lists
		.filter((list) => user.inboxListId !== list.id && list.archived === false);
	

	const archivedLists = lists
		.filter((list) => user.inboxListId !== list.id && list.archived === true)
		.map((list) => (
			<div key={list.id} className='parent flex items-center justify-between'>
				<button
					className={`flex flex-1 cursor-pointer justify-start ${
						currentView.id === list.id
							? 'list-archived-selected rounded-md bg-cyan-200 font-semibold'
							: ''
					} lists-archived truncate rounded-xl p-1 pl-2 text-base text-gray-500`}
					onClick={() => {
						changeCurrentView(list.id as number);
					}}>
					{list.title}
				</button>
				<div
					id={`list-${list.id}`}
					className={`hidden-child flex items-center justify-end
					${currentView.id === list.id ? 'list-actions-selected' : ''}
					`}>
					<span className='ml-2'></span>
					<EditModalList
						editList={editList}
						listData={{
							id: list.id as number,
							title: list.title,
							archived: list.archived as boolean,
						}}
						parentId={`list-${list.id}`}
						deleteFunction={deleteList}
					/>
				</div>
			</div>
		));

	/* Drag and drop definitions */
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {distance: 5}
		}),
	  );
	
	  async function handleDragEnd(event: any) {
		const {active, over} = event;
		
		if (active.id !== over.id) {
	
			//Find index of item being dragged (active) and index of item being dragged over (over)
			const oldIndex = lists.findIndex(i => i.id==active.id);
			const newIndex = lists.findIndex(i => i.id==over.id);

			//Move items in the array
			const newLists = arrayMove(lists, oldIndex, newIndex);
			//Store index in list of final destination of dragged item 
			const tmpIndex = lists[newIndex].index;
			
			/* Update active and over lists */
			let tmpLists: {id:number; index:number;}[] = [];
			/* Update indexes of lists between active and over lists */
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

			// Update indexes of items between over and active lists indexes in database
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
			
			// Update state with new lists order
		    dispatchLists({ type: 'changed', payload: newLists });
		}
	  }

	return (
		<div
			className={`flexflex-col absolute left-0 top-0 my-6 w-30%  rounded-xl border-2 border-black bg-white p-10 ${
				showSidebar
					? 'animate-[sidebar-content-show_300ms]'
					: 'animate-[sidebar-content-hide_300ms]'
			} fill-mode-forwards`}
			id='sidebar'>
			<div className='absolute left-3 top-2 text-sm font-bold text-violet-600'>
				Welcome, {user.username} ;)
			</div>
			<div className='mb-1 flex flex-col'>
				<div className='mb-2 text-lg font-bold text-cyan-600'>Tareas</div>
				<button
					className={`flex cursor-pointer justify-start ${
						currentView.id === user.inboxListId
							? 'rounded-md bg-cyan-200 font-semibold'
							: ''
					} rounded-xl p-1 pl-2 text-base hover:underline hover:decoration-cyan-500 hover:decoration-2 hover:underline-offset-4`}
					onClick={() => {
						changeCurrentView(user.inboxListId);
					}}>
					{inbox !== undefined ? inbox.title : ''}
				</button>
				{ViewLists}
			</div>
			<div className='mt-4 flex flex-col'>
				<div className='mb-2 flex justify-between'>
					<div className='text-lg font-bold text-violet-600'>Lists</div>
					<CreateModalList addList={addList} />
				</div>
			<DndContext 
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				>
				<SortableContext 
					items={lists.map(list => list.id as number)}
					strategy={verticalListSortingStrategy}
				>
					{lists.map(list => <SortableListItem key={list.id} list={list} dispatchLists={dispatchLists}
						currentView={currentView} changeCurrentView={changeCurrentView} deleteList={deleteList} editList={editList} />)}
				</SortableContext>
    		</DndContext>
			</div>
			<div className='mt-4 flex flex-col'>
				<div className='mb-2 flex justify-between'>
					<div className='relative text-lg font-bold text-fuchsia-600'>
						Archived
						<span className='absolute bottom-0 left-[102%] text-xs font-semibold'>
							({archivedLists.length})
						</span>
					</div>

					<div className='flex items-center justify-center text-fuchsia-500 hover:text-fuchsia-600'>
						<ArrowDown3
							className={`collapsible ${
								archivedLists.length === 0 ? 'active' : ''
							}`}
							size='1.5rem'
						/>
					</div>
				</div>
				<div className='content'>
					{archivedLists.length === 0 ? (
						<div className='inner'>
							<div className={`p-1 pl-2 text-base text-gray-600`}>
								🦖 No archived lists
							</div>
						</div>
					) : (
						<div className='inner'>{archivedLists}</div>
					)}
				</div>
			</div>
		</div>
	);
}
