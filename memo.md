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

## 18 回 cache-first について

① cache-first
キャッシュがあれば、常にそれを見に行く。
新たにデータが追加されても、追加前のものを参照する。
→ データの変化がないときに使用する。
② no-chache
サーバーからデータを取得してもキャッシュを作らない。
③ network-only
常にサーバーサイドにアクセスしに行く。
データが取得できたら表示する。
④ cache-and-network
常にサーバーサイドにアクセスしに行く。
データが取得している間は、キャッシュにある値をとりあえず表示しておける。
→ 基本的なアプリでは、④ を使用するケースが多い。

```js
const { data, error } =
  useQuery <
  GetUsersQuery >
  (GET_USERS,
  {
    fetchPolicy: 'network-only', // 毎回cacheを見ずに、graphQLサーバーにアクセス
    // fetchPolicy: 'cache-and-network',
    //fetchPolicy: 'cache-first',
    //fetchPolicy: 'no-cache',
  })
```

## 19 回 crud について

・update や delete は、mutation なので、hasura の`useMutation`を使う。

・update

```js
const [update_users_by_pk] = useMutation < UpdateUserMutation > UPDATE_USER
```

・create

```js
const [insert_users_one] =
  useMutation <
  CreateUserMutation >
  (CREATE_USER,
  {
    // updateの場合は、cacheが自動で更新されないので、自分で更新する処理を書く.
    update(
      cache,
      { data: { insert_users_one } } // insert_users_oneという形で返ってくる
    ) {
      // cache.identify で、idを取得できる
      const cacheId = cache.identify(insert_users_one)
      cache.modify({
        fields: {
          // usersはfield名. 第一引数に既存のdataが入ってくるので、適当な名前で受け取る.
          users(existingUsers, { toReference }) {
            // toReferenceにidを渡すと、idに紐づいたdataを参照できる.
            // それと既存のdataを足す.という基本的な処理.
            return [toReference(cacheId), ...existingUsers]
          },
        },
      })
    },
  })
```

・delete

```js
const [delete_users_by_pk] =
  useMutation <
  DeleteUserMutation >
  (DELETE_USER,
  {
    // delete_users_by_pkは、queries.tsにある関数内のfield名から持ってきている
    update(cache, { data: { delete_users_by_pk } }) {
      cache.modify({
        fields: {
          users(existingUsers, { readField }) {
            return existingUsers.filter(
              // 削除したidと一致しないものだけを残す.
              (user) => delete_users_by_pk.id !== readField('id', user)
            )
          },
        },
      })
    },
  })
```
