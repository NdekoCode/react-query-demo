"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { User } from '~/lib/store/store';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const loginSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});
const addUser = () => (user: Omit<User, "id">) =>
  fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
type TLogin = z.infer<typeof loginSchema>;
export default function CreateUser() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const form = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addUser(),
    onSuccess: (_, variables) => {
      toast(`User ${variables?.name} created!`, {
        description: "User created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      timeoutRef.current = setTimeout(() => {
        router.push("/");
      }, 1000);
    },
  });
  const onSubmit = async (values: TLogin) => {
    const user = {
      name: values.name.trim(),
      email: values.email.trim(),
    };
    console.log(user);
    try {
      mutation.mutate(user);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-muted min-h-svh md:p-10">
      <div className="flex flex-col items-center justify-center gap-6 p-6 bg-muted min-h-svh md:p-10">
        <h2 className="text-2xl font-medium">Create User</h2>
        <Card className="flex flex-col w-full gap-6 min-w-sm">
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={mutation.isPending} type="submit">
                  {mutation.isPending ? "Loading..." : "Submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
