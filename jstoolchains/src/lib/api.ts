import {
	TodosApi,
	UsersApi,
	ListsApi,
} from '../../../todo-api-client/apis/index';
import { Configuration } from '../../../todo-api-client/runtime';
import { getCookie } from './utils';

const apiConfig = new Configuration({
	basePath: 'http://127.0.0.1:8000',
	headers: {
		'X-CSRFToken': getCookie('csrftoken'),
	},
});

export const clientUser = new UsersApi(apiConfig);
export const clientTodo = new TodosApi(apiConfig);
export const clientList = new ListsApi(apiConfig);
