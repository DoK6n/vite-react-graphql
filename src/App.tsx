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
import { CREATE_USER } from './lib/graphql/mutation';
import { useAuthStore } from './lib/stores/useAuthStore';

function App() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const { currentUserInfo, userLogin, mode } = useAuthStore();
  const userDisplayname =
    currentUserInfo?.displayName !== null ? currentUserInfo?.displayName : currentUserInfo.email;

  const [retrieveAllTodos, { loading, data, refetch }] = useLazyQuery(GET_USER_ALL_TODOS);
  const [addUser] = useMutation(CREATE_USER);

  const [login, setLogin] = useState<User | null>(getAuth().currentUser);

  useEffect(() => {
    const auth = getAuth();
    setLogin(auth.currentUser);
  }, [login]);

  const getData = async () => {
    const { data } = await retrieveAllTodos({
      context: {
        headers: {
          uid: currentUserInfo?.uid,
        },
      },
      // fetchPolicy: 'no-cache',
    });
    if (!data || !data.retrieveAllTodos) return;
    setTodos(data.retrieveAllTodos);
  };

  useEffect(() => {
    setLoad(loading);
  }, [loading]);

  return (
    <div className='App'>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src='/vite.svg' className='logo' alt='Vite logo' />
        </a>
      </div>
      <h1>Vite + React + graphql + firebase auth google</h1>
      <button
        onClick={async () => {
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
        }}>
        user table data insert test
      </button>
      <GoogleLogin setLogin={setLogin} />
      {mode === 'LOGIN_MODE' ? <h1>{userDisplayname}님 환영합니다.</h1> : <h1>게스트 모드</h1>}
      <div className='card'>
        <button onClick={getData}>fetch</button>
      </div>
      <div className='card'>
        {todos.map((todo, i) => (load === false ? <Todo {...todo} key={i} /> : null))}
      </div>
    </div>
  );
}

export default App;
