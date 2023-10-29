import React, { useMemo, useState } from 'react';

import { Setting2 } from 'iconsax-react';

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

// import { useToast } from '../ui/toast/use-toast';

import { viewData, timeZones } from '../../lib/userSettings';
import type { SettingsModalProps } from '../../lib/customTypes';

export default function SettingsModal({
	lists,
	settings,
}: SettingsModalProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const currentSettings = useMemo(() => {
		const tmp: Record<string, string> = {};
		settings.forEach((setting, index) => {
			tmp[setting.parameter] = setting.value;
		});
		return tmp;
	}, [settings]);

	const currentViews = useMemo(() => {
		const tmpLists = lists.map((list) => ({
			...list,
			id: list.id?.toString(),
		}));
		return [...viewData.views, ...tmpLists];
	}, [lists]);

	const [editSettings, setEditSettings] = useState(currentSettings);
	// const { toast } = useToast();

	// const closePopover = (): void => {
	// 	setIsOpen(false);
	// };

	const openPopover = (): void => {
		setIsOpen(true);
	};

	console.log('Modal settings opened');
	return (
		<Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger
				asChild={true}
				onClick={(event) => {
					openPopover();
				}}>
				<a className='mb-2 flex cursor-pointer items-center justify-start font-semibold text-cyan-500 hover:text-cyan-600'>
					<Setting2 size='1.8rem' />
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
				className='max-h-[80vh] w-96 data-[state=closed]:animate-[popover-content-hide_250ms] data-[state=open]:animate-[popover-content-show_250ms]'>
				<form
					id='listform'
					className='flex flex-col'
					onSubmit={(e) => {
						e.preventDefault();
					}}>
					<div className='mb-3 ml-4 mr-4 mt-3 flex-col items-center justify-start'>
						<h1 className='m-3'>Settings</h1>
						<div className='flex items-center justify-around'>
							<h3>Home view</h3>
							<Select
								value={editSettings.home_view}
								onValueChange={(value) => {
									console.log('New value: ', value);
									setEditSettings((old) => ({ ...old, home_view: value }));
								}}>
								<SelectTrigger className={`m-3 h-2 w-6/12 p-3`}>
									<SelectValue placeholder='Homeview' />
								</SelectTrigger>
								<SelectContent>
									{currentViews.map((list) => {
										return (
											<SelectItem key={list.id} value={list.id as string}>
												<div className='flex items-center justify-start'>
													<span>{list.title}</span>
												</div>
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</div>

						<div className='flex items-center justify-around'>
							<h3>Time zone</h3>
							<Select
								value={editSettings.timezone}
								onValueChange={(value) => {
									setEditSettings((old) => ({ ...old, timezone: value }));
								}}>
								<SelectTrigger className='m-3 h-2 w-6/12 p-3'>
									<SelectValue placeholder='Timezone' />
								</SelectTrigger>
								<SelectContent>
									{timeZones.map((timeZone) => (
										<SelectItem key={timeZone.name} value={timeZone.value}>
											{timeZone.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</form>
				<PopoverArrow className='fill-sky-500' />
			</PopoverContent>
		</Popover>
	);
}
