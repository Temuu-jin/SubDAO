export type User = {
  id: number;
  username: string;
  passwordHash: string;
  image: string;
  email: string;
  createdAt: Date;
  bio: string;
  postCount: number;
  commentCount: number;
  userSubs: number;
};

export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
  daoId: number;
  membersOnly: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PostWithCommentsAndVotes = {
  id: number;
  title: string;
  body: string;
  userId: number;
  daoId: number;
  membersOnly: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  comments: CommentWithUsername[];
  votes: Vote[];
  dao: Dao;
};

export type Comment = {
  id: number;
  body: string;
  userId: number;
  postId: number;
  commentRef: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CommentWithUsername = {
  id: number;
  user: User;
  body: string;
  userId: number;
  postId: number;
  commentRef: number;
  createdAt: Date;
  updatedAt: Date;
};
export type Dao = {
  id: number;
  name: string;
  description: string;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type Vote = {
  id: number;
  userId: number;
  postId?: number | null;
  commentId?: number | null;
  voteType: -1 | 1;
  createdAt: Date;
};
export type Membership = {
  userId: number;
  daoId: number | null;
  userSubId: number | null;
  role?: string; // This can be optional if not every membership has a defined role.
  joinedAt: Date;
};

export type VoteData = {
  upvotes: number;
  downvotes: number;
  totalVotes: number;
  upMinusDown: number;
  postId: number;
  commentId: number;
};
