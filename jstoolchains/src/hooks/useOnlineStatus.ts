import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void): () => void {
	window.addEventListener('online', callback);
	window.addEventListener('offline', callback);
	return () => {
		window.removeEventListener('online', callback);
		window.removeEventListener('offline', callback);
	};
}

// TODO : the implementation of an online status checker requires more effort.
// The navigator API is not enough to reliably know the online status: it will
// normally indicate when the device is connected to a router or local network
export function useOnlineStatus(): boolean {
	return useSyncExternalStore(
		subscribe,
		() => navigator.onLine,
		() => true,
	);
}
