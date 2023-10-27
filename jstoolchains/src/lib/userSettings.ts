import type { Todo } from '../../../todo-api-client/models/Todo';
import { type viewDataType } from './customTypes';

// TODO : come up with a way to include overdue tasks (task with a past due date) in Today view without including completed tasks
export const viewData: viewDataType = {
	viewTags: new Map([
		['today', '1t'],
		['upcoming', '2t'],
	]),
	viewTagIds: ['1t', '2t'],
	viewTagDetails: new Map([
		['1t', '🌻 Today'],
		['2t', '🌝 Upcoming'],
	]),
	viewTagFilters: new Map([
		[
			'1t',
			(todo: Todo) =>
				todo.dueDate?.toDateString() === new Date().toDateString(),
		],
		[
			'2t',
			(todo: Todo) => {
				const tmp = new Date();
				const tomorrow =
					new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate()).getTime() +
					24 * 60 * 60 * 1000;
				return (todo.dueDate?.getTime() as number) >= tomorrow;
			},
		],
	]),
};

export const PriorityEnum = {
	None: '4',
	Low: '3',
	Med: '2',
	High: '1',
};
type keys = Record<number, string>;
export const PriorityEnumRev: keys = {
	4: 'None',
	3: 'Low',
	2: 'Medium',
	1: 'High',
};
