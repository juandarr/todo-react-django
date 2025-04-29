import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EditModalList from '../modals/editModalList';
import { SortableListItemProps } from '../../lib/customTypes';
import { GripVertical as Drag } from 'lucide-react';

export default function SortableListItem({
	list,
	currentView,
	changeCurrentView,
	deleteList,
	editList,
	draggingItemId
}: SortableListItemProps) {
	if (list.index === 1 || list.archived === true) {
		return null;
	}
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({
		id: list.id as number
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	// Determine dynamic classes based on dragging state and overlay status
	const dynamicClasses = isDragging
		? 'z-50 cursor-grabbing border-[1px] border-dashed border-black bg-white shadow-xl'
		: draggingItemId !== null && !isDragging
			? 'opacity-70'
			: '';

	return (
		<div ref={setNodeRef} style={style} className={`${dynamicClasses}`}>
			<div key={list.id} className='parent flex items-center justify-between'>
				<button
					className={`${isDragging ? '' : 'cursor-grab'} ${draggingItemId !== null ? 'invisible' : 'hidden-child'}`}
					{...attributes}
					{...listeners}>
					<Drag size='1.2rem' color='#38bdf8' />
				</button>
				<button
					className={`flex flex-1 cursor-pointer justify-start ${
						currentView.id === list.id
							? 'list-active-selected rounded-md bg-cyan-200 font-semibold'
							: ''
					} lists-active truncate rounded-xl p-1 pl-2 text-base`}
					onClick={() => {
						changeCurrentView(list.id as number);
					}}>
					{list.title}
				</button>
				<div
					id={`list-${list.id}`}
					className={`${draggingItemId !== null ? 'invisible' : 'hidden-child'} flex items-center justify-end 
                            ${currentView.id === list.id ? 'list-actions-selected' : ''}`}>
					<span className='ml-2'></span>
					<EditModalList
						editList={editList}
						listData={{
							id: list.id as number,
							title: list.title,
							archived: list.archived as boolean
						}}
						parentId={`list-${list.id}`}
						deleteFunction={deleteList}
					/>
				</div>
			</div>
		</div>
	);
}
