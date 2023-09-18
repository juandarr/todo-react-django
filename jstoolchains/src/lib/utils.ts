import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export function getCookie(name: string): string {
	let cookieValue: string = name;
	if (document.cookie != null && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.substring(0, name.length + 1) === name + '=') {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

export function getPoint(t: string): number[] {
	const target = document.getElementById(t) as HTMLElement;
	const [xTarget, yTarget] = [
		target.getBoundingClientRect().left,
		target.getBoundingClientRect().top,
	];
	const [xDoc, yDoc] = [window.innerWidth, window.innerHeight];
	return [xTarget / xDoc, yTarget / yDoc];
}
