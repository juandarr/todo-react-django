import { createContext } from 'react';
import type { userInfoType } from '../lib/customTypes';

export const UserContext = createContext<userInfoType>({
	id: 0,
	username: '',
	inboxListId: 0,
	homeListId: 0,
	timeZone: '',
});
