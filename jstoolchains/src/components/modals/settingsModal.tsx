import React, { useMemo, useState } from 'react';
import { Settings} from 'lucide-react';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	PopoverArrow,
} from '../ui/popover';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { VirtualizedSelect } from '../ui/virtualizedSelect'; // Added import

import { timeZones } from '../../lib/userSettings';
import type { SettingsModalProps } from '../../lib/customTypes';
import { useToast } from '../ui/toast/use-toast';

export default function SettingsModal({
	lists,
	settings,
	editSetting,
}: SettingsModalProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const currentSettings = useMemo(() => {
		const tmp: Record<string, { value: string; id: number }> = {};
		settings.forEach((setting, index) => {
			tmp[setting.parameter] = {
				value: setting.value,
				id: setting.id as number,
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
				description: '',
			});
		} catch (error) {
			if (error instanceof Error) {
				toast({
					variant: 'destructive',
					title: 'There was an error updating the setting: ',
					description: error.toString(),
				});
			}
		}
	};

	const openPopover = (): void => {
		setIsOpen(true);
	};

	const timeZonesTmp: Array<{ label: string; value: string }> = [];
	for (let i = 0; i < timeZones.length; i += 1) {
		timeZonesTmp.push({ label: timeZones[i], value: timeZones[i] });
	}
	console.log('Modal settings opened');
	return (
		<Popover modal={false} open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger
				asChild={true}
				onClick={(event) => {
					openPopover();
				}}>
				<a className='mb-2 flex cursor-pointer items-center justify-start font-semibold text-cyan-500 hover:text-cyan-600'>
					<Settings size='1.8rem'strokeWidth={'1.5px'}/>
					<p className='ml-4'>Settings</p>
				</a>
			</PopoverTrigger>
			<PopoverContent
				align={'center'}
				side={'left'}
				onOpenAutoFocus={(event) => {}}
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}
				className='max-h-[80vh] w-80 data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='listform'
					className='flex flex-col'
					onSubmit={(e) => {
						e.preventDefault();
					}}>
					<div className='flex-col items-center justify-start'>
						<h1 className='mb-3 ml-3 mr-3 mt-3 text-xl font-bold text-cyan-500'>
							Settings
						</h1>
						<div className='mb-3 ml-3 text-sm'>
							Customize the application settings.
						</div>
						<div className='ml-3 mr-3 flex items-center justify-between'>
							<h3>Home view</h3>
							<Select
								value={editSettings.home_view.value}
								onValueChange={(value) => {
									setEditSettings((old) => ({
										...old,
										home_view: { ...old.home_view, value },
									}));
									editHandleSubmit(editSettings.home_view.id, value)
										.then(() => {})
										.catch(() => {});
								}}>
								<SelectTrigger className='select__control mb-3 mt-3 h-2 w-7/12 px-2 py-4'>
									<SelectValue placeholder='Homeview' />
								</SelectTrigger>
								<SelectContent>
									{lists.filter((list) => list.archived !== true).map((list) => {
										return (
											<SelectItem key={list.id} value={list.id+''}>
												<div className='flex items-center justify-start'>
													<span>{list.title}</span>
												</div>
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</div>
						<div className='ml-3 mr-3 flex items-center justify-between'>
							<h3>Time zone</h3>
							<VirtualizedSelect
								placeholder='Select time zone...'
								value={editSettings.timezone.value}
								className='mb-3 mt-3 w-7/12 text-sm' // Pass className to the trigger
								onValueChange={(selectedValue) => {
									setEditSettings((old) => ({
										...old,
										timezone: {
											...old.timezone,
											value: selectedValue,
										},
									}));
									editHandleSubmit(editSettings.timezone.id, selectedValue)
										.then(() => {})
										.catch(() => {});
								}}
								options={timeZonesTmp}
								// Optional: Adjust height/itemHeight if needed
								// height={250}
								// itemHeight={40}
							/>
						</div>
					</div>
				</form>
				<PopoverArrow className='fill-sky-500' />
			</PopoverContent>
		</Popover>
	);
}
