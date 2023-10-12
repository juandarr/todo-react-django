import { useState, useEffect } from 'react';

export function useModelFetch<T>(
	fetcher: Promise<T[]>,
): [T[], React.Dispatch<React.SetStateAction<T[]>>] {
	const [list, setList] = useState<T[]>([]);

	useEffect(() => {
		let ignore = false;
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
			});

		return () => {
			ignore = true;
		};
	}, []);

	return [list, setList];
}
