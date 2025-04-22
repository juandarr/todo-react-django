import React from 'react';

import type { TaskListHeaderProps } from '../../lib/customTypes';
import { ArrowDown3 as ChevronDown } from 'iconsax-reactjs';

export default function TaskListHeader({
	fieldDone,
	fieldTask,
	fieldActions,
	isComplete,
	items,
}: TaskListHeaderProps): React.JSX.Element {
	return (
		<div className={`text-md flex rounded-xl bg-gray-100 py-3 font-bold`}>
			<div className='w-2/12 px-6 text-center font-bold text-gray-700'>
				<span className='relative'>
					{fieldDone}
					<span className='absolute -bottom-1 left-[102%] text-xs font-semibold'>
						({items})
					</span>
				</span>
			</div>
			<div className='flex-1 px-4 font-bold text-gray-700'>{fieldTask}</div>
			<div className='w-[15%] pr-3 text-right text-gray-700 md:block'>
				{fieldActions}
			</div>
			<div className='flex w-[5%] items-center justify-center text-rose-500 hover:text-rose-600'>
				<ChevronDown
					className={`collapsible ${isComplete ? 'active' : ''}`}
					size='1.5rem'
					variant='Linear'
				/>
			</div>
		</div>
	);
}
