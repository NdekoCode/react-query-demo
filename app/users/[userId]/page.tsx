"use client";
import Link from 'next/link';
import { use } from 'react';
import { Loader } from '~/components/Loader';
import { getPosts } from '~/lib/services/posts.service';
import { getUser, getUserPosts } from '~/lib/services/users.service';

import { useQuery, useQueryClient } from '@tanstack/react-query';

const UserPage: React.FC<{ params: Promise<{ userId: string }> }> = ({
  params,
}) => {
  const parameter = use(params);
  const userId = parameter.userId as string;
  const queryClient = useQueryClient();
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
    queryKey: ["users", userId, "posts"],
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
          <li
            key={post.id}
            onMouseEnter={() => {
              queryClient.prefetchQuery({
                queryKey: ["posts", post.id],
                queryFn: () => getPosts(post.id.toString()!),
              });
            }}
          >
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
