import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import 'cross-fetch/polyfill'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

const createApolloClient = () => {
  return new ApolloClient({
    // ブラウザでない = serverSide 場合、true
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: 'https://basic-lesson-hasura2.hasura.app/v1/graphql',
      headers: {
        'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_KEY,
      },
    }),
    cache: new InMemoryCache(),
  })
}
export const initializeApollo = (initialState = null) => {　
  // client-sideのrendingの場合、apolloClientに値があるのでそれを返す
  const _apolloClient = apolloClient ?? createApolloClient()
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

// https://github.com/vercel/next.js/blob/canary/examples/with-apollo/lib/apolloClient.js
// を参考