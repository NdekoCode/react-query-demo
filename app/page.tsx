"use client";
import Link from 'next/link';
import { Loader } from '~/components/Loader';
import { UserLine } from '~/components/UserLine';
import { UsersResponseSchema } from '~/lib/schema/user.schema';

import { useQuery } from '@tanstack/react-query';

const getUsers = async () => {
  const res = await fetch("/api/users");
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  const data = await res.json();
  return UsersResponseSchema.parse(data);
};

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (isLoading) return <Loader />;
  if (isError) return <div>Something went wrong</div>;

  return (
    <div className="container flex flex-col gap-4 mt-10">
      <div className="flex justify-start">
        <Link href="/users/new" className="p-2 text-white bg-blue-500 rounded">
          Create
        </Link>
      </div>
      <h1 className="text-4xl font-bold">Users</h1>
      <ul className="flex flex-col gap-2">
        {data?.users.map((user) => (
          <UserLine key={user.id} user={user} />
        ))}
      </ul>
    </div>
  );
}
