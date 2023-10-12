import { useState, useEffect } from 'react';

export function useModelFetch<T>(
	fetcher: any,
	dependency: any,
): [T[], React.Dispatch<React.SetStateAction<T[]>>] {
	const [list, setList] = useState<T[]>([]);

	useEffect(() => {
		if (dependency === null) {
			return;
		}
		let ignore = false;
		fetcher
			.then((result: T[]) => {
				if (!ignore) {
					setList(result);
				}
			})
			.catch((error: any) => {
				if (error instanceof Error) {
					console.log('There was an error retrieving data: ', error.message);
				}
			});

		return () => {
			ignore = true;
		};
	}, [dependency]);

	return [list, setList];
}
