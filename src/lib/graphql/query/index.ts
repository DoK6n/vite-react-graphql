import gql from 'graphql-tag';

/**
 * ### 특정 유저의 모든 할일 목록 조회
 * ```graphql
 * retrieveAllTodos: [Todo!]
 * ```
 * @headers uid
 */
export const GET_USER_ALL_TODOS = gql`
  query retrieveAllTodos {
    retrieveAllTodos {
      id
      content
      done
      isRemoved
      userId
      createdDt
      updatedDt
      removedDt
      orderKey
    }
  }
`;

/**
 * ### 특정 유저의 할일 단일항목 조회
 * ```graphql
 * retrieveTodo(id: String!): Todo
 * ```
 * @headers uid
 */
export const GET_USER_TODO = gql`
  query retrieveTodo($id: String!) {
    retrieveTodo(id: $id) {
      content
      done
      isRemoved
      createdDt
      updatedDt
      removedDt
      orderKey
    }
  }
`;

/**
 * ### 특정 유저의 휴지통 목록 조회
 * ```graphql
 * retrieveAllRemovedTodo: [Todo!]
 * ```
 * @headers uid
 */
export const GET_USER_ALL_REMOVED_TODOS = gql`
  query retrieveAllRemovedTodo {
    retrieveAllRemovedTodo {
      id
      userId
      content
      done
      isRemoved
      createdDt
      removedDt
      orderKey
    }
  }
`;

/**
 * ### 특정 유저의 휴지통에 삭제된 할일 단일항목 조회
 * ```graphql
 * retrieveRemovedTodo(id: String!): Todo
 * ```
 * @headers uid
 */
export const GET_USER_REMOVED_TODO = gql`
  query retrieveRemovedTodo($id: String!) {
    retrieveRemovedTodo(id: $id) {
      userId
      content
      done
      isRemoved
      createdDt
      updatedDt
      removedDt
      orderKey
    }
  }
`;

/**
 * ### 특정 유저 단일 조회
 * ```graphql
 * retrieveUserById: UserWithSnsType
 * ```
 * @headers uid
 */
export const GET_USER = gql`
  query retrieveUserById {
    retrieveUserById {
      id
      email
      name
      snsType
    }
  }
`;
