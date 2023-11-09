import React from 'react';

import type { TaskListHeaderProps } from '../../lib/customTypes';
import { ArrowDown3 } from 'iconsax-react';

export default function TaskListHeader({
	fieldDone,
	fieldTask,
	fieldActions,
	isComplete,
}: TaskListHeaderProps): React.JSX.Element {
	return (
		<div className={`text-md flex rounded-xl bg-gray-100 py-3 font-bold`}>
			<p className='w-2/12 px-6 text-center font-bold text-gray-700'>
				{fieldDone}
			</p>
			<p className='flex-1 px-6 font-bold text-gray-700'>{fieldTask}</p>
			<p className='w-2/12 px-3 text-right text-gray-700 md:block'>
				{fieldActions}
			</p>
			<div className='flex w-[5%] items-center justify-center text-rose-500 hover:text-rose-600'>
				<ArrowDown3
					className={`collapsible ${isComplete ? 'active' : ''}`}
					size='1.5rem'
				/>
			</div>
		</div>
	);
}
