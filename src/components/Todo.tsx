import { ITodo } from '../interfaces/todo';
import dayjs from 'dayjs';

export default function Todo(todo: ITodo) {
  return (
    <button style={{ margin: '1em', textAlign: 'left' }}>
      <div>{todo.id}</div>
      <div>{todo.isInactive ? '비활성화' : '활성화'}</div>
      <div>{todo.isRemoved ? '삭제됨' : '삭제안됨'}</div>
      <div>생성일 : {`${dayjs(todo.createdDt).format('YYYY-MM-DD HH:mm:ss')}`}</div>
      <div>유저 : {todo.userId}</div>
    </button>
  );
}
