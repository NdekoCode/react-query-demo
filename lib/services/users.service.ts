import { PostsResponseSchema } from '../schema/post.schema';
import { UserResponseSchema, UsersResponseSchema } from '../schema/user.schema';
import { User } from '../store/store';

export const getUsers = async () => {
  const res = await fetch("/api/users");
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  const data = await res.json();
  return UsersResponseSchema.parse(data);
};

export const getUser = (userId: string) =>
  fetch(`/api/users/${userId}`)
    .then((res) => res.json())
    .then(UserResponseSchema.parse);

export const getUserPosts = (userId: string) =>
  fetch(`/api/users/${userId}/posts`)
    .then((res) => res.json())
    .then(PostsResponseSchema.parse);

export const addUser = () => (user: Omit<User, "id">) =>
  fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
