import { useMutation, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import React, { MouseEventHandler } from 'react';
import { ITodo } from '../interfaces/todo';
import { DELETE_ALL_REMOVED_TODOS, RECYCLE_REMOVED_TODO } from '../lib/graphql/mutation';
import { GET_USER_ALL_REMOVED_TODOS, GET_USER_ALL_TODOS } from '../lib/graphql/query';
import { useAuthStore } from '../lib/stores/useAuthStore';
import Todo from './Todo';
import Trash from './Trash';

interface AllRemovedTodoQuery {
  retrieveAllRemovedTodo: ITodo[] | null;
}

export default function TrashBin() {
  const { currentUserInfo } = useAuthStore();
  const [deleteAllRemovedTodos] = useMutation(DELETE_ALL_REMOVED_TODOS);
  const retrieveAllRemovedTodo = useQuery<AllRemovedTodoQuery>(GET_USER_ALL_REMOVED_TODOS, {
    context: {
      headers: {
        uid: currentUserInfo?.uid,
      },
    },
  });

  const { data, loading, error } = retrieveAllRemovedTodo;

  const onClearTrashBin: MouseEventHandler<HTMLButtonElement> = async () => {
    await deleteAllRemovedTodos({
      context: {
        headers: {
          uid: currentUserInfo?.uid,
        },
      },
      refetchQueries: [
        {
          query: GET_USER_ALL_REMOVED_TODOS,
          context: {
            headers: {
              uid: currentUserInfo?.uid,
            },
          },
        },
      ],
    });
  };

  return (
    <React.Fragment>
      <button onClick={onClearTrashBin}>휴지통 비우기</button>
      <div>
        {data && data.retrieveAllRemovedTodo
          ? data.retrieveAllRemovedTodo.map((todo, i) => <Trash key={i} todo={todo} />)
          : null}
      </div>
    </React.Fragment>
  );
}
