import gql from 'graphql-tag';

export const GET_USER_ALL_TODOS = gql`
  query retrieveAllTodos {
    retrieveAllTodos(uid: "f7103b59-8b45-4650-b699-7817b8cce23b") {
      id
      content
      isInactive
      isRemoved
      userId
      createdDt
      updatedDt
      removedDt
    }
  }
`;

export const GET_USER_TODO = gql`
  query {
    retrieveTodo(id: "fe1b1c10-060c-4860-aaf0-048905e59b7c", uid: "f7103b59-8b45-4650-b699-7817b8cce23b") {
      content
      isInactive
      isRemoved
      createdDt
      updatedDt
      removedDt
    }
  }
`;

export const GET_USER_REMOVED_TODO = gql`
  query {
    retrieveAllRemovedTodo(uid: "f7103b59-8b45-4650-b699-7817b8cce23b") {
      id
      userId
      content
      isInactive
      isRemoved
      createdDt
      # updatedDt,
      removedDt
    }
  }
`;

export const GET_USER_ALL_REMOVED_TODOS = gql`
  query {
    retrieveRemovedTodo(id: "9cd64bfe-eb57-483a-a9c1-5df3b48d8d70", uid: "f7103b59-8b45-4650-b699-7817b8cce23b") {
      userId
      content
      isInactive
      isRemoved
      createdDt
      updatedDt
      removedDt
    }
  }
`;

export const GET_USER = gql`
  query retrieveUserById($data: FindUserInput!) {
    retrieveUserById(data: $data) {
      id
      email
      name
      snsType
    }
  }
`;
