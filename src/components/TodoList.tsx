import { useMutation, useQuery } from '@apollo/client';
import produce from 'immer';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { ITodo } from '../interfaces/todo';
import { ADD_NEW_TODO } from '../lib/graphql/mutation';
import { GET_USER_ALL_TODOS } from '../lib/graphql/query';
import { useAuthStore } from '../lib/stores/useAuthStore';
import Todo from './Todo';

const newContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        level: 2,
      },
      content: [
        {
          text: 'Hello',
          type: 'text',
        },
      ],
    },
  ],
};

interface AllTodosQuery {
  retrieveAllTodos: ITodo[] | null;
}

export default function TodoList() {
  // const client = useApolloClient();
  // const data = client.readQuery({
  //   query: GET_USER_ALL_TODOS,
  // });
  // const onClearCache = () => {
  //   client.cache.evict({ id: '' }); // cache id에 해당하는 데이터 제거
  // };

  // const [updateDndTodo] = useMutation(UPDATE_DND_TODO);
  // await updateDndTodo({
  //   data: {},
  //   context: {
  //     headers: {
  //       uid: currentUserInfo?.uid,
  //     },
  //   },
  // });
  // };

  const { currentUserInfo } = useAuthStore();

  const [addNewTodo] = useMutation(ADD_NEW_TODO);
  const { loading, data } = useQuery<AllTodosQuery>(GET_USER_ALL_TODOS, {
    context: {
      headers: {
        uid: currentUserInfo?.uid,
      },
    },
  });

  // Todo 드래그 기능
  const onDragAndDropHandler = () => {
    const draggingItemIndex = 2; // 옮길 요소의 인덱스
    const afterDragItemIndex = 0; // 옮기고 싶은 위치의 인덱스

    if (!data || !data.retrieveAllTodos) return;

    const nextState = produce(data.retrieveAllTodos, draft => {
      const [draggingItem] = draft.splice(draggingItemIndex, 1); // 옮길 요소만 뺌
      draft.splice(afterDragItemIndex, 0, draggingItem); // 원하는 인덱스에 빼낸 요소 삽입

      draft.reverse().forEach((todo, i) => {
        // 배열 반전 후 orderKey 변경
        todo.orderKey = i + 1;
      });

      draft.reverse(); // 배열 재 반전
    });
    console.log('nextState: ', nextState);
  };

  // 테스트용 Todo 생성
  const onAddnewTodoHandler = async () => {
    await addNewTodo({
      variables: {
        data: {
          content: newContent,
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
      ],
    });
  };

  return (
    <div className='cardWrapper'>
      <button onClick={onAddnewTodoHandler}>Add new Todo</button>
      <button onClick={onDragAndDropHandler}>dnd last to first</button>
      {data && data.retrieveAllTodos
        ? data.retrieveAllTodos.map((todo, i) => <Todo todo={todo} orderKey={i} key={i} />)
        : null}
    </div>
  );
}
