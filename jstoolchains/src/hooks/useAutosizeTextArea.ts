import { useEffect } from 'react';
import { waitForElementToExist } from '../lib/utils';

// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (
	textAreaRef: HTMLTextAreaElement | null,
	selector: string,
	value: string,
): void => {
	useEffect(() => {
		waitForElementToExist(selector)
			.then((element) => {
				// We need to reset the height momentarily to get the correct scrollHeight for the textarea
				(textAreaRef as HTMLTextAreaElement).style.height = '0px';

				// We then set the height directly, outside of the render loop
				// Trying to set this with state or a ref will product an incorrect value.
				(
					textAreaRef as HTMLTextAreaElement
				).style.height = `${textAreaRef?.scrollHeight}px`;
			})
			.catch(() => {});
	}, [textAreaRef, value]);
};

export default useAutosizeTextArea;
