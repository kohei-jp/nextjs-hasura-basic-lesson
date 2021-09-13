import { gql } from '@apollo/client'

// serverに取りに行く
export const GET_USERS = gql`
  query GetUsers {
    users(order_by: { created_at: desc }) {
      id
      name
      created_at
    }
  }
`
// clientにあるキャッシュを取りに行く
export const GET_USERS_LOCAL = gql`
query GetUsers {
  users(order_by: {created_at: desc}) @client {
    id
    name
    created_at
  }
}
`

export const GET_USERIDS = gql`
  query GetUserIds {
    users(order_by: { created_at: desc }) {
      id
    }
  }
`

export const GET_USERBY_ID = gql`
  query GetUserById($id: uuid!) {
    users_by_pk(id: $id) {
      id
      name
      created_at
    }
  }
`

export const CREATED_USER = gql`
  mutation CreateUser($name: String!) {
    insert_users_one(object: {name: $name}) {
      id
      name
      created_at
    }
  }
`
// クエリの引数を変数化 = $***, ! は、必須

export const DELETE_USER = gql`
  mutation DeleteUser($id: uuid!) {
    delete_users_by_pk(id: $id) {
      id
      name
      created_at
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser($id: uuid!, $name: String!) {
    update_users_by_pk(pk_columns: {id: $id}, _set: {name: $name}) {
      id
      name
      created_at
    }
  }
`
