export interface ITodo {
  id: string;
  content?: object;
  isInactive: boolean;
  isRemoved: boolean;
  userId: string;
  createdDt: Date;
  updatedDt?: Date;
  removedDt?: Date;
}
