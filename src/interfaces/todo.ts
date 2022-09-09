import { RemirrorJSON } from 'remirror';

export interface ITodo {
  id: string;
  content?: RemirrorJSON;
  done: boolean;
  isRemoved: boolean;
  userId: string;
  createdDt: Date;
  updatedDt?: Date;
  removedDt?: Date;
  orderKey: number;
}
