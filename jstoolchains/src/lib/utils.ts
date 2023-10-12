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

export function isDescendantOf(
	element: HTMLElement | null,
	parentTag: string,
): boolean {
	while (element !== null) {
		if (element.nodeName.toLowerCase() === parentTag) {
			return true;
		}
		element = element.parentElement;
	}
	return false;
}

export async function waitForElementToExist(selector: string): Promise<void> {
	await new Promise((resolve) => {
		if (document.querySelector(selector) !== null) {
			resolve(document.querySelector(selector));
		}

		const observer = new MutationObserver(() => {
			if (document.querySelector(selector) !== null) {
				resolve(document.querySelector(selector));
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			subtree: true,
			childList: true,
		});
	});
}

export const checkOnlineStatus = async (): Promise<boolean> => {
	try {
		const online = await fetch('/api/status');
		return online.status >= 200 && online.status < 300;
	} catch (error) {
		return false; // It is offline
	}
};
/* Use the following portion of code to test every async api function */
// setTimeout(() => {
//   const value = Math.random();
//   if (value > 0.5) {
//     closePopover();
//   } else {
//     setError("Invented error");
//     setStatus("viewing");
//   }
// }, 2000);
