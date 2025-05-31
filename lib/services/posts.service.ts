import { PostResponseSchema } from '../schema/post.schema';

export const getPosts = async (postId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return fetch(`/api/posts/${postId}`)
    .then((res) => res.json())
    .then(PostResponseSchema.parse);
};
