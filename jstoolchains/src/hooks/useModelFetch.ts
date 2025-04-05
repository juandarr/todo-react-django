import { useState, useEffect } from 'react';

export function useModelFetch<T>(
	fetcher: Promise<T[]>,
): [T[], React.Dispatch<React.SetStateAction<T[]>>, boolean] {
	const [list, setList] = useState<T[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		let ignore = false;
		setLoading(true); // Ensure loading is true when fetch starts
		fetcher
			.then((result: T[]) => {
				if (!ignore) {
					setList(result);
				}
			})
			.catch((error: Error) => {
				if (error instanceof Error) {
					console.log('There was an error retrieving data: ', error.message);
				}
			})
			.finally(() => {
				// Set loading to false regardless of success or error
				if (!ignore) {
					setLoading(false);
				}
			});

		return () => {
			ignore = true;
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Keep dependencies empty to run only on mount

	return [list, setList, loading];
}
