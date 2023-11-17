import React, { useContext } from 'react';

import { type SideBarProps } from '../../lib/customTypes';

import CreateModalList from '../modals/createModalList';
import EditModalList from '../modals/editModalList';
import { UserContext } from '../../contexts/UserContext';

export default function SideBar({
	lists,
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
				currentView.id === value ? 'rounded-md bg-cyan-200 font-semibold' : ''
			} rounded-xl p-1 pl-2 text-lg hover:underline hover:decoration-rose-500 hover:decoration-2 hover:underline-offset-4`}
			onClick={() => {
				changeCurrentView(value);
			}}>
			{viewData.viewTagDetails.get(value)}
		</button>
	));

	const otherLists = lists
		.filter((list) => user.inboxListId !== list.id)
		.map((list) => (
			<div key={list.id} className='parent flex items-center justify-between'>
				<button
					className={`flex flex-1 cursor-pointer justify-start ${
						currentView.id === list.id
							? 'rounded-md bg-cyan-200 font-semibold'
							: ''
					} truncate rounded-xl p-1 pl-2 text-lg hover:underline hover:decoration-rose-500 hover:decoration-2 hover:underline-offset-4`}
					onClick={() => {
						changeCurrentView(list.id as number);
					}}>
					{list.title}
				</button>
				<div
					id={`list-${list.id}`}
					className='hidden-child flex items-center justify-end'>
					<span className='ml-2'></span>
					<EditModalList
						editList={editList}
						listData={{ id: list.id as number, title: list.title }}
						parentId={`list-${list.id}`}
						deleteFunction={deleteList}
					/>
				</div>
			</div>
		));

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
				<div className='mb-2 text-xl font-bold'>Tareas</div>
				<button
					className={`flex cursor-pointer justify-start ${
						currentView.id === user.inboxListId
							? 'rounded-md bg-cyan-200 font-semibold'
							: ''
					} rounded-xl p-1 pl-2 text-lg hover:underline hover:decoration-rose-500 hover:decoration-2 hover:underline-offset-4`}
					onClick={() => {
						changeCurrentView(user.inboxListId);
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
