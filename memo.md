## ・16 回 apollo-client の`useQuery`メソッドを使って、Hasura の GraphQL サーバーからデータを取得

```js
// ① graphQLをnext.jsで使用できる様に、apollo-clientのセットアップ
// → lib/apollo-client.tsにてapollo-clientインスタンスのinitializeなど記載.
// _app.tsで、どのコンポーネントからもappllo-clientに参照できる様に設定
function MyApp({ Component, pageProps }: AppProps) {
  const client = initializeApollo()
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

// ② コンポーネントにて、取得
const { data, error } = useQuery < GetUsersQuery > GET_USERS

// ③ GET_USERSで実行させるクエリは、 query/query.tsで定義されている.
export const GET_USERS = gql`
  query GetUsers {
    users(order_by: { created_at: desc }) {
      id
      name
      created_at
    }
  }
`
```

## 17 回

<!-- 16回でgraphQLサーバーから取得したデータは、自動的にapollo-clientのcacheに入っている。 -->
<!-- 今度は、cacheを参照する。 -->

```js
// ・クエリに@clientをつけるだけ
export const GET_USERS_LOCAL = gql`
  query GetUsers {
    users(order_by: { created_at: desc }) @client {
      id
      name
      created_at
    }
  }
`

// ・以下ではcacheから取得しに行っている.
const { data } = useQuery < GetUsersQuery > GET_USERS_LOCAL
```
