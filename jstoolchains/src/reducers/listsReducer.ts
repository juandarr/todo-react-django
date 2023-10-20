export default function listsReducer(lists, action) {
	switch (action.type) {
		case 'added': {
		}
		case 'edited': {
		}
		case 'deleted': {
		}
		default: {
			throw Error('Unknown action: ' + action.type);
		}
	}
}
