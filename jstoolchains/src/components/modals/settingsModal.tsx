import React, { useMemo, useState } from 'react';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';

import { Flag, Setting2 } from 'iconsax-react';

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

import { useToast } from '../ui/toast/use-toast';

import { PriorityEnum } from '../../lib/userSettings';
import type { SettingsModalProps } from '../../lib/customTypes';

const timeZones = [
	{ name: '(GMT -12:00) Eniwetok, Kwajalein', value: '-12:00' },
	{ name: '(GMT -11:00) Midway Island, Samoa', value: '-11:00' },
	{ name: '(GMT -10:00) Hawaii', value: '-10:00' },
	{ name: '(GMT -9:30) Taiohae', value: '-09:50' },
	{ name: '(GMT -9:00) Alaska', value: '-09:00' },
	{ name: '(GMT -8:00) Pacific Time (US &amp; Canada)', value: '-08:00' },
	{ name: '(GMT -7:00) Mountain Time (US &amp; Canada)', value: '-07:00' },
	{
		name: '(GMT -6:00) Central Time (US &amp; Canada), Mexico City',
		value: '-06:00',
	},
	{
		name: '(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima',
		value: '-05:00',
	},
	{ name: '(GMT -4:30) Caracas', value: '-04:50' },
	{
		name: '(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz',
		value: '-04:00',
	},
	{ name: '(GMT -3:30) Newfoundland', value: '-03:50' },
	{ name: '(GMT -3:00) Brazil, Buenos Aires, Georgetown', value: '-03:00' },
	{ name: '(GMT -2:00) Mid-Atlantic', value: '-02:00' },
	{
		name: '(GMT -1:00) Azores, Cape Verde Islands',
		value: '-01:00',
	},
	{
		name: '(GMT) Western Europe Time, London, Lisbon, Casablanca',
		value: '+00:00',
	},
	{ name: '(GMT +1:00) Brussels, Copenhagen, Madrid, Paris', value: '+01:00' },
	{ name: '(GMT +2:00) Kaliningrad, South Africa', value: '+02:00' },
	{
		name: '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg',
		value: '+03:00',
	},
	{ name: '(GMT +3:30) Tehran', value: '+03:50' },
	{ name: '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi', value: '+04:00' },
	{ name: '(GMT +4:30) Kabul', value: '+04:50' },
	{
		name: '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent',
		value: '+05:00',
	},
	{ name: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi', value: '+05:50' },
	{ name: '(GMT +5:45) Kathmandu, Pokhara', value: '+05:75' },
	{ name: '(GMT +6:00) Almaty, Dhaka, Colombo', value: '+06:00' },
	{ name: '(GMT +6:30) Yangon, Mandalay', value: '+06:50' },
	{ name: '(GMT +7:00) Bangkok, Hanoi, Jakarta', value: '+07:00' },
	{ name: '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong', value: '+08:00' },
	{ name: '(GMT +8:45) Eucla', value: '+08:75' },
	{
		name: '(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk',
		value: '+09:00',
	},
	{ name: '(GMT +9:30) Adelaide, Darwin', value: '+09:50' },
	{
		name: '(GMT +10:00) Eastern Australia, Guam, Vladivostok',
		value: '+10:00',
	},
	{ name: '(GMT +10:30) Lord Howe Island', value: '+10:50' },
	{
		name: '(GMT +11:00) Magadan, Solomon Islands, New Caledonia',
		value: '+11:00',
	},
	{ name: '(GMT +11:30) Norfolk Island', value: '+11:50' },
	{
		name: '(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka',
		value: '+12:00',
	},
	{ name: '(GMT +12:45) Chatham Islands', value: '+12:75' },
	{ name: '(GMT +13:00) Apia, Nukualofa', value: '+13:00' },
	{ name: '(GMT +14:00) Line Islands, Tokelau', value: '+14:00' },
];

export default function SettingsModal({
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

	const [editSettings, setEditSettings] = useState(currentSettings);
	const { toast } = useToast();

	const closePopover = (): void => {
		setIsOpen(false);
	};

	const openPopover = (): void => {
		setIsOpen(true);
	};

	console.log('Modal settings opened');
	return (
		<Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
			<TooltipProvider>
				<Tooltip>
					<PopoverTrigger
						asChild={true}
						onClick={(event) => {
							openPopover();
						}}>
						<TooltipTrigger>
							<a className='mb-2 flex items-center justify-start font-semibold text-cyan-500 hover:text-cyan-600'>
								<Setting2 size='1.8rem' />
								<p className='ml-4'>Settings</p>
							</a>
						</TooltipTrigger>
					</PopoverTrigger>
					<TooltipContent className='bg-sky-500'>
						<p className='font-bold text-white'>Edit todo</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
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
					<div className='mb-3 ml-4 mr-4 mt-3 flex items-center justify-between'>
						<Select
							value={editSettings.home_view}
							onValueChange={(value) => {
								setEditSettings((old) => ({ ...old, home_view: value }));
							}}>
							<SelectTrigger className={`mr-3 h-2 w-5/12 p-3`}>
								<SelectValue placeholder='Priority' />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(PriorityEnum).map((item, idx) => {
									return (
										<SelectItem key={idx} value={item[1]}>
											<div className='flex items-center justify-start'>
												<Flag
													className={`mr-1.5`}
													size={'1rem'}
													variant='Bold'
												/>
												<span>{item[0]}</span>
											</div>
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
						<Select
							value={editSettings.timezone}
							onValueChange={(value) => {
								setEditSettings((old) => ({ ...old, timezone: value }));
							}}
							disabled={status === 'submitting'}>
							<SelectTrigger className='h-2 w-6/12 p-3'>
								<SelectValue placeholder='List' />
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
				</form>
				<PopoverArrow className='fill-sky-500' />
			</PopoverContent>
		</Popover>
	);
}
