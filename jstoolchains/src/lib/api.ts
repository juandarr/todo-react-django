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

export const changePasswordApi = async (
	oldPassword: string,
	newPassword1: string,
	newPassword2: string
) => {
	const response = await fetch('http://127.0.0.1:8000/api/password_change/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': getCookie('csrftoken') || ''
		},
		body: JSON.stringify({
			old_password: oldPassword,
			new_password1: newPassword1,
			new_password2: newPassword2
		})
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.detail || JSON.stringify(errorData));
	}

	return response.json();
};
