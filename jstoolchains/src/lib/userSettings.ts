import type { Todo } from '../../../todo-api-client/models/Todo';
import { type viewDataType } from './customTypes';

// TODO : come up with a way to include overdue tasks (task with a past due date) in Today view without including completed tasks
export const viewData: viewDataType = {
	viewTags: new Map([
		['today', '0'],
		['upcoming', '-1'],
	]),
	viewTagIds: ['0', '-1'],
	viewTagDetails: new Map([
		['0', '🌻 Today'],
		['-1', '🌝 Upcoming'],
	]),
	viewTagFilters: new Map([
		[
			'0',
			(todo: Todo) =>
				todo.dueDate?.toDateString() === new Date().toDateString(),
		],
		[
			'-1',
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
