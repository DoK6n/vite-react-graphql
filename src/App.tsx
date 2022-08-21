import './App.css';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { ITodo } from './interfaces/todo';
import Todo from './components/Todo';
import { GET_USER_ALL_TODOS } from './lib/graphql/query';
import { v4 as uuidv4 } from 'uuid';

import GoogleLogin from './components/GoogleLogin';
import { getAuth, User } from 'firebase/auth';
import { CREATE_USER } from './lib/graphql/mutation';
import { useAuthStore } from './lib/stores/useAuthStore';

function App() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const { currentUserInfo, userLogin, mode } = useAuthStore();
  const userDisplayname = currentUserInfo?.displayName !== null ? currentUserInfo?.displayName : currentUserInfo.email;

  const [retrieveAllTodos, { loading, data, refetch }] = useLazyQuery(GET_USER_ALL_TODOS);
  const [addUser] = useMutation(CREATE_USER);

  const [login, setLogin] = useState<User | null>(getAuth().currentUser);

  useEffect(() => {
    const auth = getAuth();
    setLogin(auth.currentUser);
  }, [login]);

  const getData = () => {
    retrieveAllTodos().then(({ data }) => {
      if (data && data.retrieveAllTodos) {
        setTodos(data.retrieveAllTodos);
      }
    });
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
        onClick={() => {
          const uuid = uuidv4();
          console.log(uuid);
          addUser({
            variables: {
              data: {
                id: uuid,
                email: uuid.split('-')[1] + '@gmail.com',
                name: 'test' + uuid.split('-')[1],
                snsTypeName: 'google.com',
                createDt: '2022-08-16 10:00:00'
              }
            },
            context: {
              headers: {
                uid: uuid
              }
            }
          });
        }}>
        user table data insert test
      </button>
      <GoogleLogin setLogin={setLogin} />
      {mode === 'LOGIN_MODE' ? <h1>{userDisplayname}님 환영합니다.</h1> : <h1>게스트 모드</h1>}
      <div className='card'>
        <button onClick={getData}>fetch</button>
      </div>
      <div className='card'>{todos.map((todo, i) => (load === false ? <Todo {...todo} key={i} /> : null))}</div>
    </div>
  );
}

export default App;
