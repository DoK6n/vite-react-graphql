import './App.css';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { ITodo } from './interfaces/todo';
import Todo from './components/Todo';
import { GET_USER_ALL_TODOS } from './lib/graphql/query';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';

import GoogleLogin from './components/GoogleLogin';
import { getAuth, User } from 'firebase/auth';
import { CREATE_USER, ADD_NEW_TODO } from './lib/graphql/mutation';
import { useAuthStore } from './lib/stores/useAuthStore';
import TodoList from './components/TodoList';

import produce from 'immer';

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

function App() {
  // const [todos, setTodos] = useState<ITodo[]>([]);
  const { currentUserInfo, mode } = useAuthStore();
  const userDisplayname =
    currentUserInfo?.displayName !== null ? currentUserInfo?.displayName : currentUserInfo.email;
  // const [retrieveAllTodos, { loading, data, refetch }] = useLazyQuery(GET_USER_ALL_TODOS);
  const [addUser] = useMutation(CREATE_USER);
  const [addNewTodo] = useMutation(ADD_NEW_TODO);
  const [login, setLogin] = useState<User | null>(getAuth().currentUser);

  useEffect(() => {
    const auth = getAuth();
    setLogin(auth.currentUser);
  }, [login]);

  interface AllTodosQuery {
    retrieveAllTodos: ITodo[] | null;
  }

  const { loading, data, refetch } = useQuery<AllTodosQuery>(GET_USER_ALL_TODOS, {
    context: {
      headers: {
        uid: currentUserInfo?.uid,
      },
    },
  });

  useEffect(() => {
    // setTodos(data);
    console.log(data);
  }, [data]);

  // 테스트 계정 생성
  const onCreateUserHandler = async () => {
    const newUid = nanoid(28);
    console.log('new nanoid: ' + newUid);

    await addUser({
      variables: {
        data: {
          email: newUid.substring(0, 4) + '@gmail.com',
          name: 'test' + newUid.substring(0, 4),
          snsTypeName: 'google.com',
          createDt: '2022-08-22 16:00:00',
        },
      },
      context: {
        headers: {
          uid: newUid,
        },
      },
    });
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

  return (
    <div className='App'>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src='/vite.svg' className='logo' alt='Vite logo' />
        </a>
      </div>
      <h1>Vite + React + graphql + firebase auth google</h1>
      <button onClick={onCreateUserHandler}>테스트용 계정 생성</button>
      <GoogleLogin setLogin={setLogin} />
      {mode === 'LOGIN_MODE' ? <h1>{userDisplayname}님 환영합니다.</h1> : <h1>게스트 모드</h1>}

      {/* <div className='card'><button onClick={getData}>fetch</button></div> */}
      <button onClick={onAddnewTodoHandler}>Add new Todo</button>
      <button onClick={onDragAndDropHandler}>dnd last to first</button>
      <TodoList>
        {data && data.retrieveAllTodos
          ? data.retrieveAllTodos.map((todo, i) => <Todo todo={todo} orderKey={i} key={i} />)
          : null}
      </TodoList>
    </div>
  );
}

export default App;
