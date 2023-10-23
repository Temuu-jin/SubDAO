export type User = {
  id?: number;
  username: string;
  passwordHash: string;
  email: string;
  createdAt?: Date;
  // Uncomment the fields below if you need them
  // bio: string;
  // postCount: number;
  // commentCount: number;
  // daos: number[];
};

export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Comment = {
  id: number;
  body: string;
  userId: number;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Dao = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type CreateUserArgs = {
  username: string;
  email: string;
  password: string;
};
