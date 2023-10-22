import { createContext } from 'react';
import type { userInfoType } from '../lib/customTypes';

export const UserContext = createContext<userInfoType>({
	id: 0,
	username: '',
	homeListId: 0,
	inboxListId: 0,
});
