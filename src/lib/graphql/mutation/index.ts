import { gql } from '@apollo/client';

/**
 * ### 테스트용 유저 생성
 * ```graphql
 * addUser(data: CreateUserInput!): User!
 * ```
 */
export const CREATE_TEST_USER = gql`
  mutation addUser {
    addUser(
      data: {
        email: "test@test.com"
        name: "tester"
        snsTypeName: "google"
        createDt: "2022-08-15 16:46:00"
      }
    ) {
      id
      email
      name
      snsTypeId
    }
  }
`;

/**
 * ### 유저 생성
 * ```graphql
 * addUser(data: CreateUserInput!): User!
 * ```
 */
export const CREATE_USER = gql`
  mutation addUser($data: CreateUserInput!) {
    addUser(data: $data) {
      id
      email
      name
      snsTypeId
    }
  }
`;

/**
 * ### 새로운 할일 추가
 * ```graphql
 * input CreateTodoInput {
 *  content: JSON
 *  orderKey: number
 * }
 * addNewTodo(data: CreateTodoInput!): Todo
 * ```
 *
 * @headers uid
 *
 */
export const ADD_NEW_TODO = gql`
  mutation addNewTodo($data: CreateTodoInput!) {
    addNewTodo(data: $data) {
      id
      content
      userId
      createdDt
      updatedDt
      removedDt
      done
      isRemoved
    }
  }
`;

/**
 * ### 특정 유저의 할일 수정
 * ```graphql
 * editTodoContent(data: UpdateTodoContentInput!): Todo
 * ```
 * @headers uid
 */
export const EDIT_TODO_CONTENT = gql`
  mutation editTodoContent($data: UpdateTodoContentInput!) {
    editTodoContent(data: $data) {
      content
      done
      isRemoved
      updatedDt
    }
  }
`;

/**
 * ### 특정 유저의 할일 완료 여부 수정
 * ```graphql
 * editTodoDone(data: UpdateTodoDoneInput!): Todo
 * ```
 * @headers uid
 */
export const EDIT_TODO_DONE = gql`
  mutation editTodoDone($data: UpdateTodoDoneInput!) {
    editTodoDone(data: $data) {
      content
      done
      isRemoved
      updatedDt
    }
  }
`;

/**
 * ### 특정 유저의 할일 제거 _(휴지통)_
 * ```graphql
 * removeTodo($data: { id: String! }): Todo
 * ```
 * @headers uid
 */
export const REMOVE_TODO = gql`
  mutation removeTodo($data: TodoIdInput!) {
    removeTodo(data: $data) {
      userId
      content
      done
      isRemoved
      createdDt
      updatedDt
      removedDt
    }
  }
`;

/**
 * ### 휴지통에서 할일 단일항목 복원
 * ```graphql
 * recycleRemovedTodo(id: String!): Todo
 * ```
 */
export const RECYCLE_REMOVED_TODO = gql`
  mutation recycleRemovedTodo($data: TodoIdInput!) {
    recycleRemovedTodo(data: $data) {
      userId
      content
      done
      isRemoved
      createdDt
      updatedDt
      removedDt
    }
  }
`;

/**
 * ### 휴지통에서 할일 단일항목 영구삭제
 * ```graphql
 * deleteRemovedTodo(id: String!): Todo
 * ```
 */
export const DELETE_REMOVED_TODO = gql`
  mutation deleteRemovedTodo($data: TodoIdInput!) {
    deleteRemovedTodo(data: $data) {
      content
      isRemoved
      createdDt
      updatedDt
      removedDt
    }
  }
`;

/**
 * ### 휴지통 비우기
 * ```graphql
 * deleteAllRemovedTodos: [Todo!]
 * ```
 */
export const DELETE_ALL_REMOVED_TODOS = gql`
  mutation deleteAllRemovedTodos {
    deleteAllRemovedTodos {
      id
    }
  }
`;
