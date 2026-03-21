export type RegisterPayload = {
  name: string;
  email: string;
  userid: string;
  password: string;
};

export type LoginPayload = {
  key: string;
  password: string;
};

export type Note = {
  noteid: number;
  title: string;
  content: string;
  tag: string;
  userid: string;
  createdAt: string;
};