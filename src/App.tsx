import './App.css';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ITodo } from './interfaces/todo';
import Todo from './components/Todo';
import { GET_USER_ALL_TODOS } from './graphql/query';

function App() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const { loading, data, refetch } = useQuery(GET_USER_ALL_TODOS);

  const getData = () => {
    setTodos(data.retrieveAllTodos);
    console.log(data.retrieveAllTodos[0]);
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
      <h1>Vite + React + graphql</h1>
      <div className='card'>
        <button onClick={getData}>fetch</button>
      </div>
      <div className='card'>{todos.map((todo, i) => (load === false ? <Todo {...todo} key={i} /> : null))}</div>
    </div>
  );
}

export default App;
