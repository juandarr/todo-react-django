import type { Todo } from '../../../todo-api-client/models/Todo';

export const userSettings = {
	homeListId: 1,
	inboxListId: 1,
	todayListId: '0',
	listViews: new Map([
		['0', '🌻 Today'],
		['-1', '🔮 Upcoming'],
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
				(todo.dueDate?.toDateString() as string) > new Date().toDateString(),
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
