import {
  ApolloClient,
  ApolloLink,
  gql,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';

const REFRESH_TOKEN_MUTATION = gql`
  mutation Refresh {
    refresh
  }
`;

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

  const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        // Replace this with the actual error message for an expired token
        if (err.message === 'Session token expired') {
          // Call the refresh token mutation
          getClient()
            .mutate({ mutation: REFRESH_TOKEN_MUTATION })
            .then((response) => {
              // Store the new session token
              const newSessionToken = response.data.refresh;
              localStorage.setItem('sessionToken', newSessionToken);

              // Retry the original request
              const headers = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...headers,
                  authorization: `Bearer ${newSessionToken}`,
                },
              });
              return forward(operation);
            })
            .catch((error) => {
              // Redirect to login page
              console.error(error);
              window.location.href = '/login';
            });
        }
      }
    }
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
  const combinedLink = ApolloLink.from([errorLink, link]);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: combinedLink,
  });
});
