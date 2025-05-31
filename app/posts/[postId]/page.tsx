"use client";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Loader } from '~/components/Loader';
import { getPosts } from '~/lib/services/posts.service';
import { getUser } from '~/lib/services/users.service';

import { useQuery } from '@tanstack/react-query';

export default function PostPage() {
  const params = useParams();
  const postId = params.postId as string;

  // Post state
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => getPosts(postId),
  });
  // User state
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["users", data?.post.userId],
    queryFn: () => getUser(data?.post.userId.toString()!),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-4xl font-bold">{data?.post.name}</h1>
      {userLoading && <Loader />}
      {userError && <div>Something went wrong</div>}
      {userData && (
        <Link href={`/users/${userData?.user?.id}`} className="hover:underline">
          By {userData?.user?.name}
        </Link>
      )}
      <hr />
      <p>{data?.post.content}</p>
    </div>
  );
}
