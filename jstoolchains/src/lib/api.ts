import {
	TodosApi,
	UsersApi,
	ListsApi,
	SettingsApi,
} from '../../../todo-api-client/apis/index';
import { Configuration } from '../../../todo-api-client/runtime';
import { getCookie } from './utils';

const apiConfig = new Configuration({
	basePath: 'http://localhost:8000',
	headers: {
		'X-CSRFToken': getCookie('csrftoken'),
	},
});

export const clientUser = new UsersApi(apiConfig);
export const clientTodo = new TodosApi(apiConfig);
export const clientList = new ListsApi(apiConfig);
export const clientSetting = new SettingsApi(apiConfig);
