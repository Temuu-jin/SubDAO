import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';

export const { getClient } = registerApolloClient(() => {
  // This is for the GitHub GraphQL endpoint
  const flyioLink = new HttpLink({
    uri: 'https://subdao.fly.dev/api/graphql',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // This is for the local GraphQL endpoint
  const localLink = new HttpLink({
    // uri: '/api/graphql',
    uri: 'http://localhost:3000/api/graphql',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // This is needed because two endpoints are being used
  const link = split(
    // Split based on the target URI
    ({ operationName }) => {
      return operationName.startsWith('https://subdao.fly.dev');
    },
    flyioLink,
    localLink,
  );

  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });
});
