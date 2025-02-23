import React, { useState, type CSSProperties } from 'react';

import type { ArchiveModalListProps } from '../../lib/customTypes';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	PopoverArrow,
	PopoverClose,
} from '../ui/popover';

import { useToast } from '../ui/toast/use-toast';

import { DirectboxReceive, DirectboxSend } from 'iconsax-react';

export default function ArchiveModalList({
	editFunction,
	listData,
}: ArchiveModalListProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [status, setStatus] = useState('viewing');
	const { toast } = useToast();

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		event.preventDefault();
		setStatus('submitting');

		try {
			await editFunction(listData.id, {
				archived: !listData.archived,
			});
			toast({
				title: `List was ${listData.archived ? 'restored' : 'archived'}`,
				description: '',
			});
			closePopover();
		} catch (error) {
			if (error instanceof Error) {
				toast({
					variant: 'destructive',
					title: `There was an error ${
						!listData.archived ? 'restoring' : 'archiving'
					} the list: `,
					description: error.message,
				});
			}
			setStatus('viewing');
		}
	};

	const closePopover = (): void => {
		setIsOpen(false);
	};

	const openPopover = (): void => {
		setStatus('viewing');
		setIsOpen(true);
	};

	console.log('Archive modal is rendered');
	return (
		<Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
			<TooltipProvider>
				<Tooltip>
					<PopoverTrigger
						asChild={true}
						onClick={() => {
							openPopover();
						}}>
						<TooltipTrigger>
							<div className='ml-4 mr-4 flex items-center text-violet-500 hover:cursor-pointer hover:text-violet-600'>
								{listData.archived ? <DirectboxSend /> : <DirectboxReceive />}
							</div>
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className='bg-violet-500'>
						<p className='font-bold text-white'>
							{listData.archived ? 'Restore' : 'Archive'}
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent
				align={'center'}
				onOpenAutoFocus={(event) => {}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}
				className='data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='listform'
					className='flex flex-col'
					onSubmit={(e) => {
						handleSubmit(e).catch((error) => {
							console.log('Error deleting entity: ', error);
						});
					}}>
					<div className='m-4 rounded-xl text-left text-gray-900'>
						Are you sure you want to{' '}
						<span className='font-medium'>
							{' '}
							{!listData.archived ? 'archive' : 'restore'}
						</span>{' '}
						this <span className='font-medium'> list</span>?
					</div>
					<div className='mb-4 ml-4 mr-4 flex items-center justify-end'>
						<PopoverClose asChild={true}>
							<button
								className='flex h-9 w-fit items-center justify-center rounded-xl border-2 border-black bg-gray-300 p-3 text-lg text-black hover:bg-gray-400 focus-visible:ring focus-visible:ring-gray-300 disabled:bg-gray-100'
								disabled={status === 'submitting'}>
								Cancel
							</button>
						</PopoverClose>
						<button
							type='submit'
							className='ml-4 flex h-9 w-fit items-center justify-center rounded-xl border-2 border-black bg-cyan-500 p-3 text-lg text-black hover:bg-cyan-600 focus-visible:ring  focus-visible:ring-cyan-300 disabled:bg-cyan-100'
							disabled={status === 'submitting'}>
							<span
								className={`loader ${
									status === 'submitting' ? 'block' : 'invisible'
								}`}></span>
							<span className={status === 'submitting' ? 'invisible' : 'block'}>
								Yes
							</span>
						</button>
					</div>
				</form>
				<PopoverArrow className='fill-violet-500' />
			</PopoverContent>
		</Popover>
	);
}
