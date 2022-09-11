import { useMutation, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import React, { MouseEventHandler } from 'react';
import { ITodo } from '../interfaces/todo';
import { RECYCLE_REMOVED_TODO } from '../lib/graphql/mutation';
import { GET_USER_ALL_REMOVED_TODOS, GET_USER_ALL_TODOS } from '../lib/graphql/query';
import { useAuthStore } from '../lib/stores/useAuthStore';
import Todo from './Todo';
import Trash from './Trash';

interface AllRemovedTodoQuery {
  retrieveAllRemovedTodo: ITodo[] | null;
}

export default function TrashBin() {
  const { currentUserInfo } = useAuthStore();
  const retrieveAllRemovedTodo = useQuery<AllRemovedTodoQuery>(GET_USER_ALL_REMOVED_TODOS, {
    context: {
      headers: {
        uid: currentUserInfo?.uid,
      },
    },
  });

  const { data, loading, error } = retrieveAllRemovedTodo;

  return (
    <div>
      {data && data.retrieveAllRemovedTodo
        ? data.retrieveAllRemovedTodo.map((todo, i) => <Trash key={i} todo={todo} />)
        : null}
    </div>
  );
}
