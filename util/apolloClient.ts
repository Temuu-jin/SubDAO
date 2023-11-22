import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';

export const { getClient } = registerApolloClient(() => {
  // This is for the local GraphQL endpoint
  const link = new HttpLink({
    uri: '/api/graphql',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
  });
});
