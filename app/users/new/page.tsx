"use client";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { UserResponseSchema } from '~/lib/schema/user.schema';

import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});
type TLogin = z.infer<typeof loginSchema>;
export default function CreateUser() {
  const router = useRouter();
  const form = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  const onSubmit = async (values: TLogin) => {
    const user = {
      name: values.name.trim(),
      email: values.email.trim(),
    };
    console.log(user);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(user),
      });
      const data = UserResponseSchema.parse(await res.json());
      if (data) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };
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
                <Button type="submit">
                  {form.formState.isLoading ? "Loading..." : "Submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
