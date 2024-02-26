"use client";

import * as z from "zod";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoundStore } from "~/lib/use-bound-store";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "~/app/_components/ui/dialog";

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

type EditUserModalProps = {
  user: User;
};

export function EditUserModal({ user }: EditUserModalProps) {
  const router = useRouter();
  const setSessionUser = useBoundStore((state) => state.setSessionUser);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [name, setName] = useState(user.name ?? "");
  const [username, setSlug] = useState(user.username ?? "");

  const { mutate: editUser, isLoading } = api.user.editUser.useMutation({
    onSuccess: () => {
      toast.success("Profile Updated!");
      setModalIsOpen(false);
      setSessionUser({
        ...user,
        username: username ?? null,
        name: name,
      } as User);
      router.replace(`/user/${username ?? user.id}`);
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
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name ?? "",
      username: user.username ?? "",
    },
  });

  const slugAvailable = api.user.usernameAvaliable.useQuery(
    form.watch("username"),
    {
      enabled: !!form.watch("username"),
    },
  );

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!slugAvailable.data && data.username !== user.username) {
      toast.error("Username already taken.");
      return;
    }

    if (data.name !== user.name || data.username !== user.username) {
      editUser({
        name: data.name,
        username: data.username,
      });

      setName(data.name);
      setSlug(data.username);
    } else {
      toast.info("No changes made.");
      setModalIsOpen(false);
    }
  };

  return (
    <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
      <DialogTrigger asChild>
        <Button title="Edit Profile" variant="outline" className="w-full">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <Button title="submit" type="submit" className="w-full">
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
