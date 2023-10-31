import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  createComment,
  getComments,
  getCommentsByPostId,
  getCommentsByUserId,
} from '../../../database/comments';
import { createDao, deleteDao, getDaos } from '../../../database/daos';
import {
  createPost,
  createPostInDao,
  deletePost,
  getPostByDaoId,
  getPostByUserId,
  getPosts,
} from '../../../database/posts';
import {
  createUser,
  deleteUser,
  getUserById,
  getUserByUsername,
  getUsers,
} from '../../../database/users';
import { createSessionToken } from '../../../util/auth';
import { LoginResponse } from '../../../util/types';

// typeDefs
const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    username: String!
    passwordHash: String!
    email: String!
    createdAt: DateTime!
    bio: String!
    postCount: Int!
    commentCount: Int!
    daos: [Int!]
  }

  type LoginResponse {
    user: User!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    userId: ID!
    daoId: ID
    user: User
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Comment {
    id: ID!
    body: String!
    userId: ID!
    user: User
    postId: ID!
    commentRef: ID
    post: Post
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Dao {
    id: ID!
    name: String!
    description: String!
    userId: String!
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
    postsByUser(userId: ID!): [Post!]!
    commentsByPost(postId: ID!): [Comment!]!
    commentsByUser(userId: ID!): [Comment!]!
    postsByDao(daoId: ID!): [Post!]!
  }

  type Mutation {
    registerUser(email: String!, username: String!, password: String!): User!
    deleteUser(id: ID!): User!
    loginUser(username: String!, password: String!): LoginResponse!
    createPost(title: String!, body: String!, userId: ID!): Post!
    updatePost(id: ID!, title: String!, body: String!): Post!
    deletePost(id: ID!): Post!
    createComment(body: String!, postId: ID!, userId: ID!): Comment!
    updateComment(id: ID!, body: String!): Comment!
    deleteComment(id: ID!): Comment!
    createDao(name: String!, description: String!, userId: String!): Dao!
    updateDao(id: ID!, name: String!, description: String!): Dao!
    deleteDao(id: ID!): Dao!
    createPostInDao(
      title: String!
      body: String!
      userId: ID!
      daoId: ID!
    ): Post!
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
    daos: async () => {
      return await getDaos();
    },
    comments: async () => {
      return await getComments();
    },
    postsByUser: async (parent: null, args: { userId: string }) => {
      const userId = parseInt(args.userId);
      return await getPostByUserId(userId);
    },
    commentsByPost: async (parent: null, args: { postId: string }) => {
      const postId = parseInt(args.postId);
      return await getCommentsByPostId(postId);
    },
    commentsByUser: async (parent: null, args: { userId: string }) => {
      const userId = parseInt(args.userId);
      return await getCommentsByUserId(userId);
    },
    postsByDao: async (parent: null, args: { daoId: string }) => {
      const daoId = parseInt(args.daoId);
      return await getPostByDaoId(daoId);
    },
  },

  Mutation: {
    registerUser: async (
      parent: null,
      args: { username: string; email: string; password: string },
    ) => {
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
      const passwordHash: string = await bcrypt.hash(args.password, 10);
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
      const auth: boolean = await bcrypt.compare(args.password, passwordHash);
      if (!auth) {
        throw new GraphQLError('Invalid username or password');
      }
      const user = await getUserByUsername(args.username);
      if (!user) {
        throw new GraphQLError('No user found');
      }
      const sessionToken = await createSessionToken(user);
      cookies().set('sessionToken', sessionToken.toString());
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
    createPostInDao: async (
      parent: null,
      args: { title: string; body: string; userId: string; daoId: string },
    ) => {
      if (
        !args.body ||
        !args.title ||
        typeof args.body !== 'string' ||
        typeof args.title !== 'string'
      ) {
        throw new GraphQLError('Required field is missing');
      }
      const userId = parseInt(args.userId);
      const daoId = parseInt(args.daoId);
      return await createPostInDao(args.title, args.body, userId, daoId);
    },
    deletePost: async (parent: null, args: { id: number }) => {
      const post = await deletePost(args.id);
      return post;
    },
    createDao: async (
      parent: null,
      args: { name: string; description: string; userId: string },
    ) => {
      if (
        !args.name ||
        !args.description ||
        !args.userId ||
        typeof args.userId !== 'string' ||
        typeof args.name !== 'string' ||
        typeof args.description !== 'string'
      ) {
        throw new GraphQLError('Required field is missing');
      }
      const userId = parseInt(args.userId);
      return await createDao(args.name, args.description, userId);
    },
    createComment: async (
      parent: null,
      args: { body: string; postId: string; userId: string },
    ) => {
      if (
        !args.body ||
        !args.postId ||
        !args.userId ||
        typeof args.body !== 'string' ||
        typeof args.postId !== 'string' ||
        typeof args.userId !== 'string'
      ) {
        throw new GraphQLError('Required field is missing');
      }
      const userId = parseInt(args.userId);
      const postId = parseInt(args.postId);
      return await createComment(args.body, postId, userId);
    },
    deleteDao: async (parent: null, args: { id: number }) => {
      const dao = await deleteDao(args.id);
      return dao;
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
    console.log('im in get');
    return await handler(req);
  } catch (error) {
    console.error('Error handling GET request:', error);
    throw error; // or return a formatted error response
  }
}

export async function POST(req: NextRequest, res: NextResponse): Promise<any> {
  try {
    console.log('im in post');

    return await handler(req);
  } catch (error) {
    console.error('Error handling POST request:', error);
    throw error; // or return a formatted error response
  }
}
