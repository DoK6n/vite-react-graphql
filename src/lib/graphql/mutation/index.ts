import gql from 'graphql-tag';

export const CREATE_TEST_USER = gql`
  mutation {
    addUser(
      data: {
        id: "a1111a11-1a45-1111-b111-1111b1cce11a"
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
