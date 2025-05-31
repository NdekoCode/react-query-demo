"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader } from '~/components/Loader';
import { PostResponseSchema } from '~/lib/schema/post.schema';
import { UserResponseSchema } from '~/lib/schema/user.schema';
import { Post, User } from '~/lib/store/store';

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

  // Post state
  const [data, setData] = useState<{ post: Post } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // User state
  const [user, setUser] = useState<{ user: User } | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(false);

  // Fetch post data
  useEffect(() => {
    if (!postId) return;

    let isCancelled = false;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const result = await getPosts(postId);

        if (!isCancelled) {
          setData(result);
        }
      } catch (error) {
        if (!isCancelled) {
          setIsError(true);
          console.error("Failed to fetch post:", error);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isCancelled = true;
    };
  }, [postId]);

  // Fetch user data (dependent on post data)
  useEffect(() => {
    if (!data?.post.userId) return;

    let isCancelled = false;

    const fetchUser = async () => {
      try {
        setUserLoading(true);
        setUserError(false);
        const result = await getUser(data.post.userId.toString());

        if (!isCancelled) {
          setUser(result);
        }
      } catch (error) {
        if (!isCancelled) {
          setUserError(true);
          console.error("Failed to fetch user:", error);
        }
      } finally {
        if (!isCancelled) {
          setUserLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isCancelled = true;
    };
  }, [data?.post.userId]);

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
      {user && (
        <Link href={`/users/${user.user.id}`} className="hover:underline">
          By {user.user.name}
        </Link>
      )}
      <hr />
      <p>{data?.post.content}</p>
    </div>
  );
}
