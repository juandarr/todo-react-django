'use client';

import * as React from 'react';

import { EmojiPicker } from 'frimousse';
import { MyEmojiPickerProps } from '../../lib/customTypes';

export function MyEmojiPicker({ onEmojiSelect }: MyEmojiPickerProps) {
	return (
		<EmojiPicker.Root
			className='isolate flex h-[368px] w-fit flex-col bg-white dark:bg-neutral-900'
			onEmojiSelect={onEmojiSelect}>
			<EmojiPicker.Search className='z-10 mx-2 mt-2 appearance-none rounded-md bg-neutral-100 px-2.5 py-2 text-sm dark:bg-neutral-800' />
			<EmojiPicker.Viewport className='outline-hidden relative flex-1'>
				<EmojiPicker.Loading className='absolute inset-0 flex items-center justify-center text-sm text-neutral-400 dark:text-neutral-500'>
					Loading…
				</EmojiPicker.Loading>
				<EmojiPicker.Empty className='absolute inset-0 flex items-center justify-center text-sm text-neutral-400 dark:text-neutral-500'>
					No emoji found.
				</EmojiPicker.Empty>
				<EmojiPicker.List
					className='select-none pb-1.5'
					components={{
						CategoryHeader: ({ category, ...props }) => (
							<div
								className='bg-white px-3 pb-1.5 pt-3 text-xs font-medium text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400'
								{...props}>
								{category.label}
							</div>
						),
						Row: ({ children, ...props }) => (
							<div className='scroll-my-1.5 px-1.5' {...props}>
								{children}
							</div>
						),
						Emoji: ({ emoji, ...props }) => (
							<button
								className='flex size-10 items-center justify-center rounded-md text-2xl data-[active]:bg-neutral-100 dark:data-[active]:bg-neutral-800'
								{...props}>
								{emoji.emoji}
							</button>
						)
					}}
				/>
			</EmojiPicker.Viewport>
		</EmojiPicker.Root>
	);
}
