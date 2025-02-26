import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import EditModalList from '../modals/editModalList';
import { SortableListItemProps } from '../../lib/customTypes';

export default function SortableTodoItem({todo, currentView, changeCurrentView, deleteList, editList}:SortableTodoItemProps) {
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