import { useEffect, useRef, useState } from 'react';
import { checkOnlineStatus } from '../lib/utils';

// TODO : the implementation of an online status checker requires more effort.
// The navigator API is not enough to reliably know the online status: it will
// normally indicate when the device is connected to a router or local network
export function useOnlineStatus(): boolean {
	const [isOnline, setIsOnline] = useState<boolean>(false);
	const intervalRef = useRef<NodeJS.Timeout>();

	useEffect(() => {
		// Check for online connection when component is mounted
		checkOnlineStatus()
			.then((result) => {
				setIsOnline(result);
				console.log('New online result!: ', result);
			})
			.catch((error) => {
				console.log('Error calling checkOnlineStatus: ', error);
				setIsOnline(false);
			});
		// Check for online connection every 30 seconds
		intervalRef.current = setInterval(() => {
			checkOnlineStatus()
				.then((result) => {
					setIsOnline(result);
					console.log('New online result!: ', result);
				})
				.catch((error) => {
					console.log('Error calling checkOnlineStatus: ', error);
					setIsOnline(false);
				});
		}, 30000);

		return () => {
			clearInterval(intervalRef.current);
		};
	}, []);
	return isOnline;
}
