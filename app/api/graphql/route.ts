import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { NextRequest } from 'next/server';
import {
  createComment,
  createCommentInComment,
  deleteComment,
  getComments,
  getCommentsByPostId,
  getCommentsByUserId,
} from '../../../database/comments';
import {
  createDao,
  deleteDao,
  getDaos,
  getDaosFromUser,
  memberMinusOne,
  memberPlusOne,
} from '../../../database/daos';
import {
  addMembershipDao,
  addMembershipSub,
  getAllMembersInDao,
  getAllUserDaoMemberships,
  getAllUserMemberships,
  makeMemberAdmin,
  removeAdmin,
  removeMembership,
} from '../../../database/memberships';
import {
  createPost,
  createPostInDao,
  deletePost,
  getAllPostsWithCommentsAndVotes,
  getPosts,
  getPostsByDaoId,
  getPostsByUserId,
  getPublicPostsWithCommentsAndVotes,
  getSinglePostWithCommentsAndVotes,
} from '../../../database/posts';
import {
  createUser,
  deleteUser,
  getUserById,
  getUserByUsername,
  getUsers,
} from '../../../database/users';
import {
  downvoteComment,
  downvotePost,
  getAllVotesForComment,
  getAllVotesForPost,
  getVoteForCommentByUser,
  getVoteForPostByUser,
  getVotes,
  undoVoteOnComment,
  undoVoteOnPost,
  upvoteComment,
  upvotePost,
} from '../../../database/votes';
import { createRefreshToken, createSessionToken } from '../../../util/auth';
import { setCookies } from '../../../util/cookies';
import {
  Dao,
  LoginResponse,
  Membership,
  Post,
  User,
} from '../../../util/types';

// typeDefs
const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    username: String!
    passwordHash: String!
    email: String!
    createdAt: DateTime!
    bio: String
    postCount: Int
    commentCount: Int
    daos: [Int]
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
    username: String
    daoName: String
    membersOnly: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Comment {
    id: ID!
    body: String!
    userId: ID!
    user: User
    postId: ID!
    commentId: ID
    post: Post
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Dao {
    id: ID
    name: String
    description: String
    memberCount: Int
    createdBy: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Vote {
    id: ID!
    userId: ID!
    postId: ID
    commentId: ID
    voteType: Int!
    createdAt: String!
  }

  type Membership {
    userId: ID!
    daoId: ID
    subId: ID
    role: String!
    joinedAt: String!
  }

  type VoteData {
    upvotes: Int!
    downvotes: Int!
    totalVotes: Int!
    upMinusDown: Int!
    postId: ID
    commentId: ID
  }

  type PostWithCommentsAndVotes {
    id: ID!
    title: String!
    body: String!
    userId: ID!
    daoId: ID
    membersOnly: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User
    comments: [Comment]
    votes: [Vote]
    dao: Dao
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
    daosFromUser(daos: [Int!]!): [Dao!]!
    votesOnPost(postId: ID!): VoteData!
    votesOnComment(commentId: ID!): VoteData!
    postVoteUser(userId: ID!, postId: ID!): Vote
    commentVoteUser(userId: ID!, commentId: ID!): Vote
    getDaoMembers(daoId: ID!): [Membership]
    getUserMemberships(userId: ID!): [Membership]
    votes: [Vote!]!
    getUserMembershipsFeed(userId: ID!): [Post!]!
    userById(id: ID!): User!
    getAllUserDaoMemberships(userId: ID!): [Membership]
    postsWithCommentsAndVotes: [PostWithCommentsAndVotes]
    publicPostsWithCommentsAndVotes: [PostWithCommentsAndVotes]
    singlePostWithCommentsAndVotes(postId: ID!): PostWithCommentsAndVotes
  }

  type Mutation {
    registerUser(email: String!, username: String!, password: String!): User!
    deleteUser(id: ID!): User!
    loginUser(username: String!, password: String!): LoginResponse!
    createPost(
      title: String!
      body: String!
      userId: ID!
      daoId: ID
      membersOnly: Boolean!
    ): Post!
    updatePost(id: ID!, title: String!, body: String!): Post!
    deletePost(id: ID!): Post!
    createComment(
      body: String!
      userId: ID!
      postId: ID!
      commentId: ID
    ): Comment!
    updateComment(id: ID!, body: String!): Comment!
    deleteComment(id: ID!): Comment!
    createDao(name: String!, description: String!, userId: String!): Dao!
    updateDao(id: ID!, name: String!, description: String!): Dao!
    deleteDao(id: ID!): Dao!

    joinDao(userId: ID!, daoId: ID!): Membership
    leaveDao(userId: ID!, daoId: ID!): Boolean
    upvotePost(userId: ID!, postId: ID!): Vote
    downvotePost(userId: ID!, postId: ID!): Vote
    upvoteComment(userId: ID!, commentId: ID!): Vote
    downvoteComment(userId: ID!, commentId: ID!): Vote
    undoVoteOnPost(userId: ID!, postId: ID!): Boolean
    undoVoteOnComment(userId: ID!, commentId: ID!): Boolean
    addMembershipDao(userId: ID!, daoId: ID, role: String): Membership
    addMembershipSub(userId: ID!, subId: ID, role: String): Membership
    removeMembership(userId: ID!, daoId: ID!): Boolean
    makeAdmin(userId: ID!, daoId: ID!): Membership
    removeAdmin(userId: ID!, daoId: ID!): Membership
  }
`;

// resolvers
const resolvers = {
  Query: {
    users: async () => {
      return await getUsers();
    },
    user: async (parent: null, args: { id: number }) => {
      return await getUserById(args.id);
    },
    posts: async () => {
      return await getPosts();
    },
    postsWithCommentsAndVotes: async () => {
      return await getAllPostsWithCommentsAndVotes();
    },
    publicPostsWithCommentsAndVotes: async () => {
      return await getPublicPostsWithCommentsAndVotes();
    },
    daos: async () => {
      return await getDaos();
    },
    comments: async () => {
      return await getComments();
    },
    userById: async (parent: null, args: { id: number }) => {
      return (await getUserById(args.id)) as User;
    },
    postsByUser: async (parent: null, args: { userId: string }) => {
      const userId = parseInt(args.userId);
      return await getPostsByUserId(userId);
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
      return await getPostsByDaoId(daoId);
    },
    daosFromUser: async (parent: null, args: { daos: number[] }) => {
      console.log(args.daos);
      return await getDaosFromUser(args.daos);
    },
    votesOnPost: async (parent: null, args: { postId: number }) => {
      const votes = await getAllVotesForPost(args.postId);
      const upvotes = votes.filter((vote) => vote.voteType === 1).length;
      const downvotes = votes.filter((vote) => vote.voteType === -1).length;
      const totalVotes = votes.length;
      const upMinusDown = upvotes - downvotes;
      const votesData = {
        upvotes,
        downvotes,
        totalVotes,
        upMinusDown,
        postId: args.postId,
      };

      // You need to return something from this function
      return votesData;
    },
    votesOnComment: async (parent: null, args: { commentId: number }) => {
      const votes = await getAllVotesForComment(args.commentId);
      const upvotes = votes.filter((vote) => vote.voteType === 1).length;
      const downvotes = votes.filter((vote) => vote.voteType === -1).length;
      const totalVotes = votes.length;
      const upMinusDown = upvotes - downvotes;
      const votesData = {
        upvotes,
        downvotes,
        totalVotes,
        upMinusDown,
        commentId: args.commentId,
      };

      // You need to return something from this function
      return votesData;
    },

    postVoteUser: async (
      parent: null,
      args: { userId: number; postId: number },
    ) => {
      const vote = await getVoteForPostByUser(args.userId, args.postId);
      return vote;
    },
    commentVoteUser: async (
      parent: null,
      args: { userId: number; commentId: number },
    ) => {
      const vote = await getVoteForCommentByUser(args.userId, args.commentId);
      return vote;
    },
    getDaoMembers: async (parent: null, args: { daoId: number }) => {
      const members = await getAllMembersInDao(args.daoId);
      return members;
    },
    getUserMemberships: async (parent: null, args: { userId: number }) => {
      const memberships = await getAllUserMemberships(args.userId);
      return memberships;
    },
    votes: async () => {
      const votes = await getVotes();
      return votes;
    },
    getUserMembershipsFeed: async (parent: null, args: { userId: number }) => {
      const usersMemberships: Membership[] = await getAllUserMemberships(
        args.userId,
      );

      const postsArray: Post[][] = await Promise.all(
        usersMemberships.map(async (membership) => {
          if (membership.daoId) {
            return await getPostsByDaoId(membership.daoId);
          } else {
            if (membership.daoId) {
              return await getPostsByUserId(membership.userSubId as number);
            } else {
              return [];
            }
          }
        }),
      );

      const posts: Post[] = postsArray.flat();
      return posts;
    },
    getAllUserDaoMemberships: async (
      parent: null,
      args: { userId: number },
    ) => {
      const memberships = await getAllUserDaoMemberships(args.userId);
      return memberships;
    },
    singlePostWithCommentsAndVotes: async (postId: number) => {
      const post = getSinglePostWithCommentsAndVotes(postId);
      return post;
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
      setCookies(sessionToken);

      return { user } as LoginResponse;
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
      // const createdBy = parseInt(args.userId);
      const dao = (await createDao(
        args.name,
        args.description,
        args.userId,
      )) as Dao;
      await addMembershipDao(parseInt(args.userId), dao.id);
      await makeMemberAdmin(parseInt(args.userId), dao.id);
      return dao;
    },
    createPost: async (
      parent: null,
      args: {
        title: string;
        body: string;
        userId: string;
        daoId: string;
        membersOnly: boolean;
      },
    ) => {
      if (
        !args.title ||
        typeof args.title !== 'string' ||
        !args.body ||
        typeof args.body !== 'string' ||
        !args.userId ||
        typeof args.userId !== 'string'
      ) {
        console.log('membersOnly: ', args.membersOnly);
        console.log('userId: ', args.userId);
        console.log('body: ', args.body);
        console.log('title: ', args.title);
        console.log('typeof membersOnly: ', typeof args.membersOnly);
        console.log('typeof userId: ', typeof args.userId);
        console.log('typeof body: ', typeof args.body);
        console.log('typeof title: ', typeof args.title);
        throw new GraphQLError('Required field is missing');
      }
      console.log('membersOnly: ', args.membersOnly);
      if (args.daoId) {
        const userId = parseInt(args.userId);
        const daoId = parseInt(args.daoId);
        return await createPostInDao(
          args.title,
          args.body,
          userId,
          daoId,
          args.membersOnly,
        );
      }
      if (!args.daoId || args.daoId === '0') {
        const userId = parseInt(args.userId);
        return await createPost(
          args.title,
          args.body,
          userId,
          args.membersOnly,
        );
      }
    },

    deletePost: async (parent: null, args: { id: number }) => {
      const post = await deletePost(args.id);
      return post;
    },

    createComment: async (
      parent: null,
      args: { body: string; userId: string; postId: string; commentId: string },
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
      const commentId = parseInt(args.commentId);
      if (commentId) {
        return await createCommentInComment(
          args.body,
          userId,
          postId,
          commentId,
        );
      }
      return await createComment(args.body, userId, postId);
    },
    deleteDao: async (parent: null, args: { id: number }) => {
      const dao = await deleteDao(args.id);
      return dao;
    },
    joinDao: async (parent: null, args: { userId: string; daoId: string }) => {
      if (
        !args.userId ||
        !args.daoId ||
        typeof args.userId !== 'string' ||
        typeof args.daoId !== 'string'
      ) {
        throw new GraphQLError('Required field is missing');
      }
      const newDao = await memberPlusOne(parseInt(args.daoId));
      const newMember = await addMembershipDao(
        parseInt(args.userId),
        parseInt(args.daoId),
      );
      return newMember;
    },
    leaveDao: async (parent: null, args: { userId: string; daoId: string }) => {
      if (
        !args.userId ||
        !args.daoId ||
        typeof args.userId !== 'string' ||
        typeof args.daoId !== 'string'
      ) {
        throw new GraphQLError('Required field is missing');
      }
      const newDao = await memberMinusOne(parseInt(args.daoId));

      return await removeMembership(
        parseInt(args.userId),
        parseInt(args.daoId),
      );
    },
    deleteComment: async (parent: null, args: { id: string }) => {
      const commentId = parseInt(args.id);
      const comment = await deleteComment(commentId);
      return comment;
    },
    upvotePost: async (
      parent: null,
      args: { userId: number; postId: number },
    ) => {
      return await upvotePost(args.userId, args.postId);
    },
    downvotePost: async (
      parent: null,
      args: { userId: number; postId: number },
    ) => {
      return await downvotePost(args.userId, args.postId);
    },
    upvoteComment: async (
      parent: null,
      args: { userId: number; commentId: number },
    ) => {
      return await upvoteComment(args.userId, args.commentId);
    },
    downvoteComment: async (
      parent: null,
      args: { userId: number; commentId: number },
    ) => {
      return await downvoteComment(args.userId, args.commentId);
    },
    undoVoteOnPost: async (
      parent: null,
      args: { userId: number; postId: number },
    ) => {
      return await undoVoteOnPost(args.userId, args.postId);
    },
    undoVoteOnComment: async (
      parent: null,
      args: { userId: number; commentId: number },
    ) => {
      return await undoVoteOnComment(args.userId, args.commentId);
    },
    addMembershipDao: async (
      parent: null,
      args: { userId: number; daoId: number; role: string },
    ) => {
      await memberPlusOne(args.daoId);
      return await addMembershipDao(args.userId, args.daoId);
    },

    addMembershipSub: async (
      parent: null,
      args: { userId: number; subId: number; role: string },
    ) => {
      return await addMembershipSub(args.userId, args.subId);
    },
    removeMembership: async (
      parent: null,
      args: { userId: number; daoId: number },
    ) => {
      await memberMinusOne(args.daoId);
      return await removeMembership(args.userId, args.daoId);
    },
    makeAdmin: async (
      parent: null,
      args: { userId: number; daoId: number },
    ) => {
      return await makeMemberAdmin(args.userId, args.daoId);
    },
    removeAdmin: async (
      parent: null,
      args: { userId: number; daoId: number },
    ) => {
      return await removeAdmin(args.userId, args.daoId);
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

export async function POST(req: NextRequest): Promise<any> {
  try {
    return await handler(req);
  } catch (error) {
    console.error('Error handling POST request:', error);
    throw error; // or return a formatted error response
  }
}
