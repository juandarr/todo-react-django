import React, { useMemo, useState } from 'react';

import { CloseSquare, Setting2 as Settings } from 'iconsax-reactjs';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	PopoverArrow,
	PopoverClose
} from '../ui/popover';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '../ui/select';
import { VirtualizedSelect } from '../ui/virtualizedSelect'; // Added import

import { timeZones } from '../../lib/userSettings';
import type { SettingsModalProps } from '../../lib/customTypes';
import { useToast } from '../ui/toast/use-toast';

export default function SettingsModal({
	isWindowWidthMedium,
	lists,
	settings,
	editSetting
}: SettingsModalProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const currentSettings = useMemo(() => {
		const tmp: Record<string, { value: string; id: number }> = {};
		settings.forEach((setting, index) => {
			tmp[setting.parameter] = {
				value: setting.value,
				id: setting.id as number
			};
		});
		return tmp;
	}, [settings]);

	const [editSettings, setEditSettings] = useState(currentSettings);

	const { toast } = useToast();
	const editHandleSubmit = async (id: number, value: string): Promise<void> => {
		try {
			await editSetting(id, value);
			toast({
				title: 'Setting was updated!',
				description: ''
			});
		} catch (error) {
			if (error instanceof Error) {
				toast({
					variant: 'destructive',
					title: 'There was an error updating the setting: ',
					description: error.toString()
				});
			}
		}
	};

	const timeZonesTmp: Array<{ label: string; value: string }> = [];
	for (let i = 0; i < timeZones.length; i += 1) {
		timeZonesTmp.push({ label: timeZones[i], value: timeZones[i] });
	}
	console.log('Modal settings opened');
	return (
		<Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild={true}>
				<button className='mb-2 flex cursor-pointer items-center justify-start font-semibold text-cyan-500 hover:text-cyan-600'>
					<Settings size='1.8rem' variant='Bulk' />
					<p className='ml-4'>Settings</p>
				</button>
			</PopoverTrigger>
			<PopoverContent
				align={'center'}
				side={isWindowWidthMedium ? 'bottom' : 'left'}
				collisionPadding={{ top: 10, right: 20 }}
				onOpenAutoFocus={(event) => {}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}
				className='max-h-[80vh] w-80 data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='settingsform'
					className='flex flex-col'
					onSubmit={(e) => {
						e.preventDefault();
					}}>
					<div className='m-4 flex-col items-center justify-start rounded-xl text-left'>
						<div className='font-medium text-gray-900'>
							Customize the application{' '}
							<span className=' text-cyan-500'>settings</span>
						</div>
						<div className='flex items-center justify-between'>
							<h3>Home view</h3>
							<Select
								value={editSettings.home_view.value}
								onValueChange={(value) => {
									setEditSettings((old) => ({
										...old,
										home_view: { ...old.home_view, value }
									}));
									editHandleSubmit(editSettings.home_view.id, value)
										.then(() => {})
										.catch(() => {});
								}}>
								<SelectTrigger className='select__control mb-3 mt-3 h-2 w-7/12 px-2 py-4'>
									<SelectValue placeholder='Homeview' />
								</SelectTrigger>
								<SelectContent>
									{lists
										.filter((list) => list.archived !== true)
										.map((list) => {
											return (
												<SelectItem key={list.id} value={list.id + ''}>
													<div className='flex items-center justify-start'>
														<span>{list.title}</span>
													</div>
												</SelectItem>
											);
										})}
								</SelectContent>
							</Select>
						</div>
						<div className='flex items-center justify-between'>
							<h3>Time zone</h3>
							<VirtualizedSelect
								placeholder='Select time zone...'
								value={editSettings.timezone.value}
								className='select__control mb-3 mt-3 h-2 w-7/12 px-2 py-4'
								onValueChange={(selectedValue: string) => {
									setEditSettings((old) => ({
										...old,
										timezone: {
											...old.timezone,
											value: selectedValue
										}
									}));
									editHandleSubmit(editSettings.timezone.id, selectedValue)
										.then(() => {})
										.catch(() => {});
								}}
								options={timeZonesTmp}
							/>
						</div>
						<PopoverClose
							className='absolute right-2 top-2 text-gray-400 hover:text-gray-500'
							aria-label='Close'>
							<CloseSquare />
						</PopoverClose>
					</div>
				</form>
				<PopoverArrow className='fill-sky-500' />
			</PopoverContent>
		</Popover>
	);
}
