import type { Todo } from '../../../todo-api-client/models/Todo';
import { type userSettingsType } from './customTypes';

export const userSettings: userSettingsType = {
	homeListId: '0',
	inboxListId: 1,
	todayListId: '0',
	viewLists: ['0', '-1'],
	listViews: new Map([
		['0', '🌻 Today'],
		['-1', '🌝 Upcoming'],
	]),
	listViewsFilters: new Map([
		[
			'0',
			(todo: Todo) =>
				todo.dueDate?.toDateString() === new Date().toDateString(),
		],
		[
			'-1',
			(todo: Todo) =>
				(todo.dueDate?.getTime() as number) > new Date().getTime(),
		],
	]),
};

export const PriorityEnum = {
	None: '4',
	Low: '3',
	Medium: '2',
	High: '1',
};
type keys = Record<number, string>;
export const PriorityEnumRev: keys = {
	4: 'None',
	3: 'Low',
	2: 'Medium',
	1: 'High',
};
