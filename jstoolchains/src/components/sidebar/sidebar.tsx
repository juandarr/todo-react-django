import React from 'react';

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
}: SideBarProps): React.JSX.Element {
	const otherLists = lists
		.filter(
			(list) =>
				![userSettings.inboxListId, userSettings.todayListId].includes(
					list.id as number,
				),
		)
		.map((list) => (
			<div key={list.id} className='parent flex items-center justify-between'>
				<button
					className={`flex flex-1 cursor-pointer justify-start ${
						currentList.id === list.id
							? 'rounded-md bg-cyan-200 font-semibold'
							: ''
					} truncate rounded-xl p-1 pl-2 text-lg hover:underline hover:decoration-rose-500 hover:decoration-2`}
					onClick={() => {
						changeCurrentList(list.id as number);
					}}>
					{list.title}
				</button>
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
						deleteEntity='list'
						parentId={`list-${list.id}`}
						id={list.id as number}
					/>
				</div>
			</div>
		));
	const inbox = lists.find((list) => userSettings.inboxListId === list.id);

	const ViewLists = userSettings.viewLists.map((value) => (
		<button
			key={value}
			className={`flex cursor-pointer justify-start ${
				currentList.id === value ? 'rounded-md bg-cyan-200 font-semibold' : ''
			} rounded-xl p-1 pl-2 text-lg hover:underline hover:decoration-rose-500 hover:decoration-2`}
			onClick={() => {
				changeCurrentList(value);
			}}>
			{userSettings.listViews.get(value)}
		</button>
	));
	return (
		<div
			className={`w-30% flexflex-col absolute left-0 top-0 my-6  rounded-xl border-2 border-black bg-white p-10 ${
				showSidebar
					? 'animate-[sidebar-content-show_300ms]'
					: 'animate-[sidebar-content-hide_300ms]'
			} fill-mode-forwards`}
			id='sidebar'>
			<div className='mb-1 flex flex-col'>
				<div className='mb-2 text-xl font-bold'>Tareas</div>
				<button
					className={`flex cursor-pointer justify-start ${
						currentList.id === userSettings.inboxListId
							? 'rounded-md bg-cyan-200 font-semibold'
							: ''
					} rounded-xl p-1 pl-2 text-lg hover:underline hover:decoration-rose-500 hover:decoration-2`}
					onClick={() => {
						changeCurrentList(userSettings.inboxListId);
					}}>
					{inbox !== undefined ? inbox.title : ''}
				</button>
				{ViewLists}
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
