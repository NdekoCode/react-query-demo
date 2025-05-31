'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader } from '~/src/components/Loader';
import { UserLine } from '~/src/components/UserLine';
import { UsersResponseSchema } from '~/src/schema/user.schema';

const getUsers = async () =>
  fetch('/api/users')
    .then((res) => res.json())
    .then(UsersResponseSchema.parse);

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryFn: getUsers,
    queryKey: ['users'],
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold">Users</h1>
      <ul className="flex flex-col gap-2">
        {data.users.map((user) => (
          <UserLine key={user.id} user={user} />
        ))}
      </ul>
    </div>
  );
}
