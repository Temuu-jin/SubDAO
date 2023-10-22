import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { NextRequest } from 'next/server';
import { getUserById, getUsers } from '../../../database/users';

const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    username: String!
    passwordHash: String!
    email: String!
    createdAt: DateTime!
    # Uncomment the fields below if you need them
    # bio: String!
    # postCount: Int!
    # commentCount: Int!
    # daos: [Int!]
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    userId: ID!
    user: User!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Comment {
    id: ID!
    body: String!
    userId: ID!
    user: User!
    postId: ID!
    post: Post!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Dao {
    id: ID!
    name: String!
    description: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User!
    posts: [Post!]!
    post(id: ID!): Post!
    comments: [Comment!]!
    comment(id: ID!): Comment!
    daos: [Dao!]!
    dao(id: ID!): Dao!
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      return await getUsers();
    },
    user: async (parent: null, args: { id: string }) => {
      return await getUserById(parseInt(args.id));
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({ schema });

const handler = startServerAndCreateNextHandler(apolloServer);

export async function GET(req: NextRequest): Promise<any> {
  return await handler(req);
}

export async function POST(req: NextRequest): Promise<any> {
  return await handler(req);
}
