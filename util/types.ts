export type User = {
  id: number;
  username: string;
  passwordHash: string;
  email: string;
  createdAt: Date;
  bio: string;
  postCount: number;
  commentCount: number;
  daos: number[];
};

export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
  daoId: number;
  createdAt: Date;
  updatedAt: Date;
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
