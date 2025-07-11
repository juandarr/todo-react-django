import React, { useContext, useRef, useState, useEffect } from 'react';

import { Checkbox } from '../ui/checkbox';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '../ui/tooltip';
import { useToast } from '../ui/toast/use-toast';

import { type Todo } from '../../../../todo-api-client/models';

import {
	Calendar2 as CalendarIcon,
	Task as ListChecks,
	Flag,
	BookSaved
} from 'iconsax-reactjs';
import { GripVertical as Drag } from 'lucide-react';
import EditModalTodo from '../modals/editModalTodo';
import { UserContext } from '../../contexts/UserContext';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';

// Imports required to implement dnd-kit functionality
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableTaskItemProps } from '../../lib/customTypes';

export default function SortableTaskItem({
	todo,
	lists,
	userInfo,
	toggleTodo,
	editTodo,
	editTodoFull,
	deleteTodo,
	draggingItemId,
	isOverlayItem,
	isDragAndDropEnabled
}: SortableTaskItemProps) {
	if (todo.complete === true) {
		return null;
	}

	const user = useContext(UserContext);
	const { toast } = useToast();
	const [inFocus, setInFocus] = useState(false);

	const [newTodoEdit, setNewTodoEdit] = useState<Todo>(todo);

	const textAreaTitle = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		setNewTodoEdit(todo);
	}, [todo]);

	useAutosizeTextArea(
		textAreaTitle.current,
		`#todoTitle-${todo.id}`,
		newTodoEdit.title
	);

	const optionsFull: Intl.DateTimeFormatOptions = {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: user.timeZone,
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	};

	const optionsShort: Intl.DateTimeFormatOptions = {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: user.timeZone
	};
	const editHandler = (
		event:
			| React.MouseEvent<HTMLDivElement>
			| React.KeyboardEvent<HTMLTextAreaElement>
			| React.KeyboardEvent<HTMLDivElement>,
		todo: Todo
	): void => {
		event.preventDefault();
		if (todo.title !== newTodoEdit.title) {
			editTodo(todo.id as number, newTodoEdit.title)
				.then(() => {
					toast({
						title: 'Task title was updated!',
						description: ''
					});
					// Set inFocus to false to exit edit mode
					setInFocus(false);
					// Explicitly blur the textarea to exit edit mode
					textAreaTitle.current?.blur();
					setNewTodoEdit(newTodoEdit);
				})
				.catch((error) => {
					console.log('There was an error updating task title: ', error);
					toast({
						variant: 'destructive',
						title: 'There was an error updating task title: ',
						description: error.message
					});
				});
		} else {
			// If the title hasn't changed, just set inFocus to false
			setInFocus(false);
			// Explicitly blur the textarea to exit edit mode
			textAreaTitle.current?.blur();
			setNewTodoEdit(newTodoEdit);
		}
	};

	const handleKeyDown = (
		e:
			| React.KeyboardEvent<HTMLTextAreaElement>
			| React.KeyboardEvent<HTMLDivElement>,
		todo: Todo
	): void => {
		if (e.key === 'Enter') {
			// Submit the form when Enter is pressed
			editHandler(e, todo);
		}
	};

	function toggleHandler(checked: boolean): void {
		toggleTodo(todo.id as number, checked)
			.then((result) => {})
			.catch((error) => {
				if (error instanceof Error) {
					toast({
						variant: 'destructive',
						title: 'There was an error updating task: ',
						description: error.message
					});
				}
			});
	}

	const autoExpand = (): void => {
		(textAreaTitle.current as HTMLElement).style.height = '0px';
		(textAreaTitle.current as HTMLElement).style.height = `${
			(textAreaTitle.current as HTMLElement).scrollHeight
		}px`;
	};

	/* Resize textArea element on component mount */
	useEffect(() => {
		/* Resize text area on mount */
		autoExpand();

		const view = document.getElementById('taskView');

		/* Observe changes in parent component to adapt textarea height */
		const observer = new ResizeObserver(() => {
			autoExpand();
		});
		observer.observe(view as HTMLTextAreaElement);

		return () => {
			observer.disconnect();
		};
	}, []);

	function getTextContentWithSpaces(htmlString: string): string {
		if (!htmlString) return '';

		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlString, 'text/html');
		// Use a TreeWalker to efficiently get all text nodes
		const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);
		let textNodesContent: string[] = [];
		let currentNode: Node | null;

		while ((currentNode = walker.nextNode())) {
			// Trim whitespace from each text node and only add if non-empty
			const trimmedText = currentNode.nodeValue?.trim();
			if (trimmedText) {
				textNodesContent.push(trimmedText);
			}
		}

		// Join the non-empty text pieces with a single space
		return textNodesContent.join(' ');
	}

	const tmp = new Date();
	const today = new Date(
		tmp.getFullYear(),
		tmp.getMonth(),
		tmp.getDate()
	).getTime();

	/* Code blocks required for dnd-kit functionality */
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({
		id: todo.id as number
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	// Determine dynamic classes based on dragging state and overlay status
	const dynamicClasses = isOverlayItem
		? 'border-[1px] border-dashed border-black shadow-xl bg-white z-50' // Styles for the overlay item
		: isDragging
			? 'opacity-25' // Style for the original item being dragged (ghost)
			: draggingItemId !== null && !isDragging && !isOverlayItem
				? 'opacity-70'
				: ''; // Default: no extra styles

	return (
		<div
			ref={setNodeRef}
			style={style}
			// Apply dynamic classes and transitions
			className={`parent flex ${dynamicClasses} transition-shadow`}>
			<div
				className={`${isDragAndDropEnabled && !isOverlayItem ? '' : 'pl-[2rem] '} mt-3 flex w-2/12 items-start justify-center`}>
				{isDragAndDropEnabled && (
					<button // Make invisible if it's the overlay or if any item is dragging
						className={`${isOverlayItem ? 'ml-[-1.5rem] ' : ''} cursor-grab pr-2 pt-[1px] ${draggingItemId !== null && !isDragging && !isOverlayItem ? 'invisible' : 'hidden-child'}`}
						{...attributes}
						{...listeners}>
						<Drag size='1.5rem' color='#38bdf8' />
					</button>
				)}
				<Checkbox
					id={'checkbox-' + todo.id}
					checked={todo.complete}
					onCheckedChange={(checked) => {
						const s = document.getElementById(`item-${todo.id}`);
						s?.classList.toggle('fade-out');
						toggleHandler(checked as boolean);
					}}
					className={`${isOverlayItem ? 'mr-2' : ''} h-6 w-6 rounded-lg border-2 border-black md:h-7 md:w-7`}
				/>
			</div>
			<form className='relative flex w-8/12 flex-col' id='editTitle-form'>
				<div className='relative flex flex-1 items-center justify-start'>
					<textarea
						className={`taskitem mr-2 mt-1 h-fit w-full rounded-xl bg-white px-4 py-0.5 text-sm font-medium ${
							(todo.complete as boolean) ? 'text-gray-400' : 'text-gray-700'
						} focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-violet-400`}
						name='editTitle'
						id={`todoTitle-${todo.id}`}
						ref={textAreaTitle}
						placeholder='Enter title'
						value={newTodoEdit.title}
						onFocus={(event) => {
							setInFocus(true);
						}}
						onBlur={(event) => {
							if (event.relatedTarget?.id !== 'saveTitle-button') {
								setInFocus(false);
								setNewTodoEdit(todo);
							}
						}}
						onChange={(event) => {
							setNewTodoEdit((old) => ({
								...old,
								title: event.target.value
							}));
						}}
						onKeyDown={(e) => {
							handleKeyDown(e, todo);
						}}
						maxLength={100}
						rows={1}
					/>
					{inFocus ? (
						<>
							<div
								id='todoEditTextCount'
								className={`absolute -bottom-3.5 right-6 text-[9px] ${
									newTodoEdit.title.length < 50
										? 'text-violet-400'
										: 'text-amber-500'
								}`}>
								<span id='current'>{newTodoEdit.title.length}</span>
								<span id='maximum'>/100</span>
							</div>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger
										id='saveTitle-button'
										className='absolute -right-4 bottom-0 top-0 flex items-center justify-center'>
										<div
											className='text-violet-500 hover:text-violet-600'
											onClick={(event) => {
												editHandler(event, todo);
											}}
											style={{ cursor: 'pointer' }}>
											<BookSaved size={'1.2rem'} />
										</div>
									</TooltipTrigger>
									<TooltipContent className='bg-violet-500'>
										<p className='font-bold text-white'>Save</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</>
					) : (
						<></>
					)}
				</div>
				<div className='flex w-[90%] items-center justify-start'>
					<div className='mr-2 block overflow-hidden text-ellipsis whitespace-nowrap px-4 py-1 text-xs'>
						{getTextContentWithSpaces(todo.description as string)}
					</div>
				</div>
				<div className='mt-0 flex justify-start pb-2 pt-0 text-sm text-gray-400'>
					<div className='mr-2 flex items-center justify-start pl-4'>
						<Flag
							className={`mr-1 ${
								todo.priority === 1
									? 'text-rose-400'
									: todo.priority === 2
										? 'text-amber-400'
										: todo.priority === 3
											? 'text-sky-400'
											: 'text-gray-400'
							}`}
							size={'1rem'}
							variant='Bold'
						/>
					</div>
					<div className='mr-2 w-fit text-center'>
						{todo.dueDate !== undefined ? (
							<div
								className={`flex items-center justify-start text-gray-600 ${
									(todo.complete as boolean) ? 'line-through' : ''
								}`}>
								<CalendarIcon className='mr-1' size={'1.2rem'} />
								<div
									className={`text-xs ${
										(todo.dueDate?.getTime() as number) < today &&
										todo.complete === false
											? 'font-medium text-rose-500'
											: ''
									} `}>
									{todo.dueDate !== undefined
										? todo.allDay
											? (todo.dueDate as Date).toLocaleString(
													'en-US',
													optionsShort
												) + ', all day'
											: (todo.dueDate as Date).toLocaleString(
													'en-US',
													optionsFull
												)
										: ''}
								</div>
							</div>
						) : (
							<></>
						)}
					</div>
					{(todo.complete as boolean) ? (
						<div className='w-fit text-center'>
							<div className='flex items-center justify-start text-gray-600'>
								<ListChecks className='mr-1' size={'1.2rem'} />
								<div className='text-xs'>
									{(todo.completedAt as Date).toLocaleString(
										'en-US',
										optionsFull
									)}
								</div>
							</div>
						</div>
					) : (
						<></>
					)}
				</div>
			</form>
			<div
				id={`todo-${todo.id}`}
				// Hide actions if it's the overlay or if any item is dragging
				className={`todo-actions mt-3 flex w-2/12 items-start justify-center ${isOverlayItem || draggingItemId !== null ? 'invisible' : 'hidden-child'}`}>
				<EditModalTodo
					editTodoFull={editTodoFull}
					deleteTodo={deleteTodo}
					todo={todo}
					lists={lists}
					userInfo={userInfo}
					parentId={`todo-${todo.id}`}
					key={`edit-${todo.id}`}
				/>
			</div>
		</div>
	);
}
