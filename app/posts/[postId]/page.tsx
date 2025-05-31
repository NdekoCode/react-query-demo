'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Loader } from '~/src/components/Loader';
import { PostResponseSchema } from '~/src/schema/post.schema';
import { UserResponseSchema } from '~/src/schema/user.schema';

const getPosts = async (postId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return fetch(`/api/posts/${postId}`)
    .then((res) => res.json())
    .then(PostResponseSchema.parse);
};

const getUser = (userId: string) =>
  fetch(`/api/users/${userId}`)
    .then((res) => res.json())
    .then(UserResponseSchema.parse);

export default function PostPage() {
  const params = useParams();
  const postId = params.postId as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', postId],
    queryFn: () => getPosts(postId),
  });

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    enabled: Boolean(data?.post.userId),
    queryKey: ['users', data?.post.userId],
    queryFn: () => getUser(data?.post.userId.toString() || ''),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-4xl font-bold">{data.post.name}</h1>
      {userLoading && <Loader />}
      {userError && <div>Something went wrong</div>}
      {user && (
        <Link href={`/users/${user.user.id}`} className="hover:underline">
          By {user.user.name}
        </Link>
      )}
      <hr />
      <p>{data.post.content}</p>
    </div>
  );
}
