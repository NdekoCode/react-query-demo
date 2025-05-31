"use client";
import Link from 'next/link';
import { use } from 'react';
import { Loader } from '~/src/components/Loader';
import { PostsResponseSchema } from '~/src/schema/post.schema';
import { UserResponseSchema } from '~/src/schema/user.schema';

import { useQuery } from '@tanstack/react-query';

const getUser = (userId: string) =>
  fetch(`/api/users/${userId}`)
    .then((res) => res.json())
    .then(UserResponseSchema.parse);

const getUserPosts = (userId: string) =>
  fetch(`/api/users/${userId}/posts`)
    .then((res) => res.json())
    .then(PostsResponseSchema.parse);

const UserPage: React.FC<{ params: Promise<{ userId: string }> }> = ({
  params,
}) => {
  const parameter = use(params);
  const userId = parameter.userId as string;

  // User state
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });

  // Posts state
  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = useQuery({
    queryKey: ["user", userId, "posts"],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });

  // Fetch posts data (dependent on user loading completion)

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="container flex flex-col gap-4 p-4 mt-10">
      <div className="flex justify-start">
        <Link href="/" className="p-2 text-white bg-blue-500 rounded">
          Back
        </Link>
      </div>
      <h1 className="text-4xl font-bold">{data?.user?.name}</h1>
      <p>{data?.user?.email}</p>
      <hr />
      <h2 className="text-2xl font-bold">Posts</h2>
      <ul className="flex flex-col gap-2 p-4 list-disc">
        {postsLoading && <Loader />}
        {postsError && <div>Something went wrong</div>}
        {posts?.posts.map((post) => (
          <li key={post.id}>
            <Link className="hover:underline" href={`/posts/${post.id}`}>
              {post.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default UserPage;
