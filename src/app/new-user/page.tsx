"use client";

import * as z from "zod";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoundStore } from "~/lib/use-bound-store";

import { type User } from "~/lib/types";
import { Input } from "~/app/_components/ui/input";
import { Button } from "~/app/_components/ui/button";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from "~/app/_components/ui/form";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../_components/ui/select";

export default function Page() {
  const router = useRouter();
  const setSessionUser = useBoundStore((state) => state.setSessionUser);
  const sessionUser = useBoundStore((state) => state.user);

  const { data: session } = useSession();

  const [name, setName] = useState(session?.user.name ?? "");
  const [username, setUsername] = useState(sessionUser?.username ?? "");

  const { mutate: editUser, isLoading } = api.user.editUser.useMutation({
    onSuccess: () => {
      toast.success("Profile Updated!");
      setSessionUser({
        ...session?.user,
        name: name,
        username: username ?? null,
        userType: sessionUser?.userType,
      } as User);
      router.push("/");
    },

    onError: () => {
      toast.error("Something went wrong. Try again later.");
    },
  });

  const charWarning = (value: "max" | "min") => {
    if (value === "max") {
      return "The username must be 30 characters or less";
    } else {
      return "The username must be 3 characters or more";
    }
  };

  const reservedSlugs = [
    "app",
    "admin",
    "www",
    "api",
    "post",
    "user",
    "org",
    "new-user",
    "signin",
    "signout",
    "comment",
    "like",
    "unlike",
    "edit",
    "delete",
    "settings",
  ];

  const formSchema = z.object({
    name: z
      .string()
      .min(3, { message: charWarning("min") })
      .max(30, { message: charWarning("max") })
      .regex(/^[a-z A-Z]+$/, "The name must contain only letters"),

    username: z
      .string()
      .min(3, { message: charWarning("min") })
      .max(30, { message: charWarning("max") })
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "The username must contain only letters, numbers, period, and underscore (_)",
      )
      .refine((slug) => !reservedSlugs.includes(slug), {
        message: "This username is reserved",
      }),

    userType: z.enum(["user", "org"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: session?.user.name ?? "",
      username: sessionUser?.username ?? "",
    },
  });

  const usernameAvailable = api.user.usernameAvaliable.useQuery(
    form.watch("username"),
    {
      enabled: !!form.watch("username"),
    },
  );

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!usernameAvailable.data) {
      toast.error("Username already taken.");
      return;
    }

    if (
      data.name !== session?.user.name ||
      data.username !== sessionUser?.username
    ) {
      editUser({
        name: data.name,
        username: data.username,
        userType: data.userType,
      });

      setName(data.name);
      setUsername(data.username);
    } else {
      toast.info("No changes made.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container mx-auto mt-20 w-full max-w-lg space-y-8 rounded-lg border bg-white p-12"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Display name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Type</FormLabel>
              <div className="flex flex-col space-y-1.5">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" {...field} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper">
                    <SelectItem className="hover:cursor-pointer" value="user">
                      Individual
                    </SelectItem>

                    <SelectItem className="hover:cursor-pointer" value="org">
                      Organization
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button title="submit" type="submit" className="w-full">
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
