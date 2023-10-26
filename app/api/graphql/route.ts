import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createPost, deletePost, getPosts } from '../../../database/posts';
import {
  createUser,
  deleteUser,
  getUserById,
  getUserByUsername,
  getUsers,
} from '../../../database/users';
import { CreateUserArgs, LoginResponse, User } from '../../../util/types';

// typeDefs
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
    registerUser(email: String!, username: String!, password: String!): User!
    deleteUser(id: ID!): User!
    loginUser(username: String!, password: String!): LoginResponse!
    createPost(title: String!, body: String!, userId: ID!): Post!
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

// resolvers
const resolvers = {
  Query: {
    users: async () => {
      return await getUsers();
    },
    user: async (parent: null, args: { id: string }) => {
      return await getUserById(parseInt(args.id));
    },
    posts: async () => {
      return await getPosts();
    },
  },

  Mutation: {
    registerUser: async (parent: null, args: CreateUserArgs) => {
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
      // const passwordHash: string = await bcrypt.hash(args.password, 10);
      console.log(args);
      const passwordHash: string = await bcrypt.hash(args.password, 10);
      console.log('passwordHash Register: ', passwordHash);
      return await createUser(args.username, passwordHash, args.email);
    },
    deleteUser: async (parent: null, args: { id: number }) => {
      const user = await deleteUser(args.id);
      return user;
    },
    loginUser: async (
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
      const passwordHash: string = await bcrypt.hash(args.password, 10);
      console.log('passwordHash login: ', passwordHash);
      const auth: boolean = await bcrypt.compare(args.password, passwordHash);
      if (!auth) {
        throw new GraphQLError('Invalid username or password');
      }
      const user = await getUserByUsername(args.username);
      if (!user) {
        throw new GraphQLError('No user found');
      }
      const payload = {
        userId: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      };
      const options = {
        expiresIn: '1h',
      };
      const sessionToken = await jwt.sign(
        payload,
        process.env.JWT_SECRET!,
        options,
      );
      cookies().set('sessionToken', sessionToken);
      return { user } as LoginResponse;
    },
    createPost: async (
      parent: null,
      args: { title: string; body: string; userId: number },
    ) => {
      if (
        !args.body ||
        !args.title ||
        typeof args.body !== 'string' ||
        typeof args.title !== 'string'
      ) {
        throw new GraphQLError('Required field is missing');
      }
      return await createPost(args.title, args.body, args.userId);
    },
    deletePost: async (parent: null, args: { id: number }) => {
      const post = await deletePost(args.id);
      return post;
    },
  },
};

// schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// apollo server
const apolloServer = new ApolloServer({ schema });

// next handler
const handler = startServerAndCreateNextHandler(apolloServer);

export async function GET(req: NextRequest): Promise<any> {
  try {
    return await handler(req);
  } catch (error) {
    console.error('Error handling GET request:', error);
    throw error; // or return a formatted error response
  }
}

export async function POST(req: NextRequest, res: NextResponse): Promise<any> {
  try {
    return await handler(req);
  } catch (error) {
    console.error('Error handling POST request:', error);
    throw error; // or return a formatted error response
  }
}
