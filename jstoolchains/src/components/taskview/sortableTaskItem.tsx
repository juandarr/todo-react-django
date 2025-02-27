import React, { useContext, useRef, useState, useEffect } from 'react';

import type { TaskItemProps } from '../../lib/customTypes';

import { Checkbox } from '../ui/checkbox';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';
import { useToast } from '../ui/toast/use-toast';

import { type Todo } from '../../../../todo-api-client/models';

import DeleteModalTodo from '../modals/deleteModalTodo';
import { Calendar2, Task, Flag, BookSaved } from 'iconsax-react';
import EditModalTodo from '../modals/editModalTodo';
import { UserContext } from '../../contexts/UserContext';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';

// Imports required to implement dnd-kit functionality
import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import EditModalList from '../modals/editModalList';
import { SortableListItemProps } from '../../lib/customTypes';


export default function SortableTodoItem({todo,
  lists,
  toggleTodo,
  editTodo,
  editTodoFull,
  deleteTodo,}:SortableTodoItemProps): React.JSX.Element {
  if (todo.completed === true) {
    return null;
  }
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: todo.id as number
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        
    </div>
  );
}