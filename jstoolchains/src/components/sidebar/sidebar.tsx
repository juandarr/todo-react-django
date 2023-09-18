import React from 'react';
import { Trash } from 'iconsax-react';

import { type SideBarProps } from '../../lib/customTypes';

import CreateModalList from '../modals/createModalList';
import EditModalList from '../modals/editModalList';
import DeleteModal from '../modals/deleteModal';

export default function SideBar({
	lists,
	userSettings,
	currentList,
	changeCurrentList,
	addList,
	deleteList,
	editList,
	showSidebar,
	setShowSidebar,
}: SideBarProps): React.JSX.Element {
	const deleteElement = (
		<a className='flex cursor-pointer justify-end text-2xl text-cyan-500 hover:text-cyan-600'>
			<Trash size={'1.2rem'} />
		</a>
	);
	const otherLists = lists
		.filter((list) => list.id !== userSettings.homeListId)
		.map((list) => (
			<div key={list.id} className='parent flex items-center justify-between'>
				<div
					className={`flex-1 cursor-pointer ${
						currentList.id === list.id ? 'rounded-md bg-cyan-200' : ''
					} truncate rounded-xl p-1 pl-2 text-lg hover:underline hover:decoration-rose-500 hover:decoration-2`}
					onClick={() => {
						changeCurrentList(list.id as number);
					}}>
					{list.title}
				</div>
				<div
					id={`list-${list.id}`}
					className='hidden-child flex items-center justify-end'>
					<EditModalList
						editList={editList}
						listData={{ id: list.id as number, title: list.title }}
						parentId={`list-${list.id}`}
					/>
					<DeleteModal
						deleteFunction={deleteList}
						triggerElement={deleteElement}
						deleteEntity='list'
						parentId={`list-${list.id}`}
						id={list.id as number}
					/>
				</div>
			</div>
		));

	return (
		<div
			className={`w-25% absolute left-0 top-0 my-6 flex flex-col  rounded-xl border-2 border-black bg-white p-10 ${
				showSidebar
					? 'animate-[sidebar-content-show_300ms]'
					: 'animate-[sidebar-content-hide_300ms]'
			}`}
			id='sidebar'>
			<div className='mb-1 flex flex-col'>
				<div className='mb-2 text-xl font-bold'>Tareas</div>
				<div
					className={`cursor-pointer ${
						currentList.id === userSettings.homeListId
							? 'rounded-md bg-cyan-200'
							: ''
					} rounded-xl p-1 pl-2 text-lg hover:underline hover:decoration-rose-500 hover:decoration-2`}
					onClick={() => {
						changeCurrentList(userSettings.homeListId);
					}}>
					Inbox
				</div>
			</div>
			<div className='mt-4 flex flex-col'>
				<div className='mb-2 flex justify-between'>
					<div className='text-xl font-bold text-violet-600'>Lists</div>
					<CreateModalList addList={addList} />
				</div>
				{otherLists}
			</div>
		</div>
	);
}
