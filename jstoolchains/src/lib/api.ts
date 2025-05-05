import {
	TodosApi,
	UsersApi,
	ListsApi,
	SettingsApi
} from '../../../todo-api-client/apis/index';
import { Configuration } from '../../../todo-api-client/runtime';
import { getCookie } from './utils';

const apiConfig = new Configuration({
	basePath: 'https://task.pi.lan',
	headers: {
		'X-CSRFToken': getCookie('csrftoken')
	}
});

export const clientUser = new UsersApi(apiConfig);
export const clientTodo = new TodosApi(apiConfig);
export const clientList = new ListsApi(apiConfig);
export const clientSetting = new SettingsApi(apiConfig);
