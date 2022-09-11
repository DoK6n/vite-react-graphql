import { ITodo } from '../interfaces/todo';
import dayjs from 'dayjs';
import { useMutation } from '@apollo/client';
import { EDIT_TODO_CONTENT, EDIT_TODO_DONE } from '../lib/graphql/mutation';
import { useAuthStore } from '../lib/stores/useAuthStore';
import { GET_USER_ALL_TODOS } from '../lib/graphql/query';
import { ButtonHTMLAttributes, MouseEventHandler, useRef, useState } from 'react';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
interface TodoProps {
  todo: ITodo;
  orderKey: number;
}

export default function Todo({ todo, orderKey }: TodoProps) {
  const [isKor, setIsKor] = useState<boolean>(true);
  const [editTodoContent] = useMutation(EDIT_TODO_CONTENT);
  const [editTodoDone] = useMutation(EDIT_TODO_DONE);
  const { currentUserInfo } = useAuthStore();

  const onEditText: MouseEventHandler<HTMLButtonElement> = async () => {
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
              text: isKor ? '아폴로' : 'apollo',
              type: 'text',
            },
          ],
        },
      ],
    };

    await editTodoContent({
      variables: {
        data: {
          id: todo.id,
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
    setIsKor(state => !state);
  };

  const onTodoDone = async () => {
    await editTodoDone({
      variables: {
        data: {
          id: todo.id,
          done: !todo.done,
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
    <div className='card'>
      <button onClick={onEditText}>{isKor ? '한글' : '영어'}</button>
      <button onClick={onTodoDone}>done</button>
      <button style={{ textAlign: 'left', color: todo.done ? 'GrayText' : 'white' }}>
        <div>{todo.id.slice(0, 8)}</div>
        <div>index : {orderKey}</div>
        <div>orderKey : {todo.orderKey}</div>
        <div>{todo.done ? <BsToggleOn /> : <BsToggleOff />}</div>
        <div>
          {todo.content !== undefined &&
            todo.content.content &&
            todo.content.content[0].content &&
            todo.content.content[0].content[0].text}
        </div>
        <div>{todo.isRemoved ? '삭제됨' : '삭제안됨'}</div>
        <div>CreateDt : {`${dayjs(todo.createdDt).format('YYYY-MM-DD HH:mm:ss')}`}</div>
        <div>User : {todo.userId}</div>
      </button>
    </div>
  );
}
