import Link from 'next/link';
import { getUser, getUserPosts } from '~/lib/services/users.service';

import { useQueryClient } from '@tanstack/react-query';

import { User } from '../lib/store/store';

type UserLineProps = {
  user: User;
};

export const UserLine = ({ user }: UserLineProps) => {
  const queryClient = useQueryClient();
  return (
    <Link
      href={`/users/${user.id}`}
      onMouseEnter={() => {
        queryClient.prefetchQuery({
          queryKey: ["users", user.id],
          queryFn: () => getUser(user.id.toString()!),
        });
        queryClient.prefetchQuery({
          queryKey: ["users", user.id, "posts"],
          queryFn: () => getUserPosts(user.id.toString()!),
        });
      }}
      className="block p-6 bg-gray-800 border-gray-700 rounded-lg shadow-sm w-fit hover:bg-gray-700"
    >
      <h5 className="text-2xl font-bold tracking-tight text-white">
        {user.name}
      </h5>
      <p className="text-gray-400">{user.email}</p>
    </Link>
  );
};
