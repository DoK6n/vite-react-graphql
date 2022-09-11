import './App.css';
import React, { useEffect, useState } from 'react';
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
import TrashBin from './components/TrashBin';

function App() {
  // const [todos, setTodos] = useState<ITodo[]>([]);
  const { currentUserInfo, mode } = useAuthStore();
  const userDisplayname =
    currentUserInfo?.displayName !== null ? currentUserInfo?.displayName : currentUserInfo.email;
  // const [retrieveAllTodos, { loading, data, refetch }] = useLazyQuery(GET_USER_ALL_TODOS);
  const [addUser] = useMutation(CREATE_USER);
  const [login, setLogin] = useState<User | null>(getAuth().currentUser);

  useEffect(() => {
    const auth = getAuth();
    setLogin(auth.currentUser);
  }, [login]);

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
      {currentUserInfo && mode === 'LOGIN_MODE' ? (
        <h1>{userDisplayname}님 환영합니다.</h1>
      ) : (
        <h1>게스트 모드</h1>
      )}
      {/* <div className='card'><button onClick={getData}>fetch</button></div> */}
      {currentUserInfo && mode === 'LOGIN_MODE' ? (
        <React.Fragment>
          <TodoList />
          <hr />
          <h1>휴지통</h1>
          <TrashBin />
        </React.Fragment>
      ) : null}
    </div>
  );
}

export default App;
