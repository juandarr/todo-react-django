import { type listsType } from '../lib/customTypes';

interface actionType {
	type: string;
	[key: string]: any;
}
export default function listsReducer(
	lists: listsType,
	action: actionType,
): listsType {
	switch (action.type) {
		case 'added': {
			return [...lists, action.payload];
		}
		case 'edited': {
			return lists.map((list) => {
				if (list.id === action.payload.id) {
					return action.payload;
				} else {
					return list;
				}
			});
		}
		case 'deleted': {
			return lists.filter((list) => list.id !== action.payload.id);
		}
		default: {
			throw Error('Unknown action: ' + action.type);
		}
	}
}
