import React, { useContext } from 'react';

import { type SideBarProps } from '../../lib/customTypes';

import CreateModalList from '../modals/createModalList';
import EditModalList from '../modals/editModalList';
import { UserContext } from '../../contexts/UserContext';
import { ArrowDown3 } from 'iconsax-react';

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
			} rounded-xl p-1 pl-2 text-base hover:underline hover:decoration-cyan-500 hover:decoration-2 hover:underline-offset-4`}
			onClick={() => {
				changeCurrentView(value);
			}}>
			{viewData.viewTagDetails.get(value)}
		</button>
	));

	const otherLists = lists
		.filter((list) => user.inboxListId !== list.id && list.archived === false)
		.map((list) => (
			<div key={list.id} className='parent flex items-center justify-between'>
				<button
					className={`flex flex-1 cursor-pointer justify-start ${
						currentView.id === list.id
							? 'rounded-md bg-cyan-200 font-semibold'
							: ''
					} truncate rounded-xl p-1 pl-2 text-base hover:underline hover:decoration-violet-500 hover:decoration-2 hover:underline-offset-4`}
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

	const archivedLists = lists
		.filter((list) => user.inboxListId !== list.id && list.archived === true)
		.map((list) => (
			<div key={list.id} className='parent flex items-center justify-between'>
				<button
					className={`flex flex-1 cursor-pointer justify-start ${
						currentView.id === list.id
							? 'rounded-md bg-cyan-200 font-semibold'
							: ''
					} truncate rounded-xl p-1 pl-2 text-base text-gray-500 hover:underline hover:decoration-fuchsia-500 hover:decoration-2 hover:underline-offset-4`}
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
				<div className='mb-2 text-lg font-bold text-sky-600'>Tareas</div>
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
				{otherLists}
			</div>
			<div className='mt-4 flex flex-col'>
				<div className='mb-2 flex justify-between'>
					<div className='relative text-lg font-bold text-fuchsia-600'>
						Archived
						<span className='absolute -right-4 bottom-0 text-xs font-semibold'>
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
