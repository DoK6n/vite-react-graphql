import { useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import React, { MouseEventHandler } from 'react';
import { ITodo } from '../interfaces/todo';
import { DELETE_REMOVED_TODO, RECYCLE_REMOVED_TODO } from '../lib/graphql/mutation';
import { GET_USER_ALL_REMOVED_TODOS, GET_USER_ALL_TODOS } from '../lib/graphql/query';
import { useAuthStore } from '../lib/stores/useAuthStore';

interface TrashProps {
  todo: ITodo;
}

export default function Trash({ todo }: TrashProps) {
  const [recycleRemovedTodo] = useMutation(RECYCLE_REMOVED_TODO);
  const [deleteRemovedTodo] = useMutation(DELETE_REMOVED_TODO);
  const { currentUserInfo } = useAuthStore();

  const onRecycleRemovedTodo: MouseEventHandler<HTMLButtonElement> = async () => {
    await recycleRemovedTodo({
      variables: {
        data: {
          id: todo.id,
        },
      },
      context: {
        headers: {
          uid: currentUserInfo?.uid,
        },
      },
      refetchQueries: [
        {
          query: GET_USER_ALL_TODOS,
          context: {
            headers: {
              uid: currentUserInfo?.uid,
            },
          },
        },
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

  const showContent: MouseEventHandler<HTMLButtonElement> = () => {
    alert(JSON.stringify(todo.content));
  };

  const onDeleteRemovedTodo: MouseEventHandler<HTMLButtonElement> = async () => {
    await deleteRemovedTodo({
      variables: {
        data: {
          id: todo.id,
        },
      },
      context: {
        headers: {
          uid: currentUserInfo?.uid,
        },
      },
      refetchQueries: [
        {
          query: GET_USER_ALL_TODOS,
          context: {
            headers: {
              uid: currentUserInfo?.uid,
            },
          },
        },
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
    <div className='card'>
      <button onClick={onRecycleRemovedTodo}>복원</button>
      <button onClick={onDeleteRemovedTodo}>영구삭제</button>
      <button style={{ backgroundColor: 'transparent' }} onClick={showContent}>
        {todo.id.slice(0, 7)}
      </button>
      <div>삭제일 : {`${dayjs(todo.removedDt).format('YYYY-MM-DD HH:mm:ss')}`}</div>
    </div>
  );
}
