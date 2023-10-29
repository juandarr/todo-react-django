import type { Todo } from '../../../todo-api-client/models/Todo';
import { type viewDataType } from './customTypes';

// TODO : come up with a way to include overdue tasks (task with a past due date) in Today view without including completed tasks
export const viewData: viewDataType = {
	views: [
		{ id: '1t', title: '🌻 Today' },
		{ id: '2t', title: '🌝 Upcoming' },
	],
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

export const timeZones = [
	{ name: '(GMT -12:00) Eniwetok, Kwajalein', value: '-12:00' },
	{ name: '(GMT -11:00) Midway Island, Samoa', value: '-11:00' },
	{ name: '(GMT -10:00) Hawaii', value: '-10:00' },
	{ name: '(GMT -9:30) Taiohae', value: '-09:50' },
	{ name: '(GMT -9:00) Alaska', value: '-09:00' },
	{ name: '(GMT -8:00) Pacific Time (US &amp; Canada)', value: '-08:00' },
	{ name: '(GMT -7:00) Mountain Time (US &amp; Canada)', value: '-07:00' },
	{
		name: '(GMT -6:00) Central Time (US &amp; Canada), Mexico City',
		value: '-06:00',
	},
	{
		name: '(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima',
		value: '-05:00',
	},
	{ name: '(GMT -4:30) Caracas', value: '-04:50' },
	{
		name: '(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz',
		value: '-04:00',
	},
	{ name: '(GMT -3:30) Newfoundland', value: '-03:50' },
	{ name: '(GMT -3:00) Brazil, Buenos Aires, Georgetown', value: '-03:00' },
	{ name: '(GMT -2:00) Mid-Atlantic', value: '-02:00' },
	{
		name: '(GMT -1:00) Azores, Cape Verde Islands',
		value: '-01:00',
	},
	{
		name: '(GMT) Western Europe Time, London, Lisbon, Casablanca',
		value: '+00:00',
	},
	{ name: '(GMT +1:00) Brussels, Copenhagen, Madrid, Paris', value: '+01:00' },
	{ name: '(GMT +2:00) Kaliningrad, South Africa', value: '+02:00' },
	{
		name: '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg',
		value: '+03:00',
	},
	{ name: '(GMT +3:30) Tehran', value: '+03:50' },
	{ name: '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi', value: '+04:00' },
	{ name: '(GMT +4:30) Kabul', value: '+04:50' },
	{
		name: '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent',
		value: '+05:00',
	},
	{ name: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi', value: '+05:50' },
	{ name: '(GMT +5:45) Kathmandu, Pokhara', value: '+05:75' },
	{ name: '(GMT +6:00) Almaty, Dhaka, Colombo', value: '+06:00' },
	{ name: '(GMT +6:30) Yangon, Mandalay', value: '+06:50' },
	{ name: '(GMT +7:00) Bangkok, Hanoi, Jakarta', value: '+07:00' },
	{ name: '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong', value: '+08:00' },
	{ name: '(GMT +8:45) Eucla', value: '+08:75' },
	{
		name: '(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk',
		value: '+09:00',
	},
	{ name: '(GMT +9:30) Adelaide, Darwin', value: '+09:50' },
	{
		name: '(GMT +10:00) Eastern Australia, Guam, Vladivostok',
		value: '+10:00',
	},
	{ name: '(GMT +10:30) Lord Howe Island', value: '+10:50' },
	{
		name: '(GMT +11:00) Magadan, Solomon Islands, New Caledonia',
		value: '+11:00',
	},
	{ name: '(GMT +11:30) Norfolk Island', value: '+11:50' },
	{
		name: '(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka',
		value: '+12:00',
	},
	{ name: '(GMT +12:45) Chatham Islands', value: '+12:75' },
	{ name: '(GMT +13:00) Apia, Nukualofa', value: '+13:00' },
	{ name: '(GMT +14:00) Line Islands, Tokelau', value: '+14:00' },
];
