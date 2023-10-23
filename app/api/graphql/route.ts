import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import {
  createUser,
  deleteUser,
  getUserById,
  getUserByUsername,
  getUsers,
} from '../../../database/users';
import { CreateUserArgs, LoginResponse, User } from '../../../util/types';

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

  type LoginResponse {
    token: String!
    user: User!
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

  type Mutation {
    createUser(email: String!, username: String!, password: String!): User!
    deleteUser(id: ID!): User!
    login(username: String!, password: String!): LoginResponse!
    createPost(title: String!, body: String!): Post!
    updatePost(id: ID!, title: String!, body: String!): Post!
    deletePost(id: ID!): Post!
    createComment(body: String!, postId: ID!): Comment!
    updateComment(id: ID!, body: String!): Comment!
    deleteComment(id: ID!): Comment!
    createDao(name: String!, description: String!): Dao!
    updateDao(id: ID!, name: String!, description: String!): Dao!
    deleteDao(id: ID!): Dao!
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

  Mutation: {
    createUser: async (parent: null, args: CreateUserArgs) => {
      if (
        typeof args.username !== 'string' ||
        typeof args.email !== 'string' ||
        typeof args.password !== 'string' ||
        !args.username ||
        !args.email ||
        !args.password
      ) {
        throw new GraphQLError('Required field is missing');
      }
      const passwordHash: string = await bcrypt.hash(args.password, 10);
      return await createUser(args.username, passwordHash, args.email);
    },
    deleteUser: async (parent: null, args: { id: number }) => {
      const user = await deleteUser(args.id);
      return user;
    },
    login: async (
      parent: null,
      args: { username: string; password: string },
    ) => {
      if (
        typeof args.username !== 'string' ||
        typeof args.password !== 'string' ||
        !args.username ||
        !args.password
      ) {
        throw new GraphQLError('Required field is missing');
      }
      const user: User | undefined = await getUserByUsername(args.username);
      /*  const userNoHash = {
        id: user?.id,
        username: user?.username,
        email: user?.email,
        createdAt: user?.createdAt,
      }; */
      if (!user) {
        throw new GraphQLError('User not found');
      }
      const passwordMatch = await bcrypt.compare(
        args.password,
        user.passwordHash,
      );
      if (!passwordMatch) {
        throw new GraphQLError('Password incorrect');
      }
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      const token = await jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      cookies().set('sessionToken', token);

      return { user, token: token };
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
