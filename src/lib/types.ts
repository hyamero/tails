export type PostItem = {
  id: string;
  authorId: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  likes: number;
  likedByUser: boolean;
  parentId: string | null;
  replies: number;
  imgUrl: string | null;
  params: string | null;
};

export type TempPostItem = Omit<
  PostItem,
  "likes" | "likedByUser" | "updatedAt" | "replies"
>;

export type User = {
  id: string;
  userType: "user" | "org" | "admin";
  username: string | null;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
};

export type Post = PostItem & {
  author: User;
};
