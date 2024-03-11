"use client";

import * as z from "zod";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "~/app/_components/ui/input";
import { Button } from "~/app/_components/ui/button";
import Image from "next/image";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from "~/app/_components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useBoundStore } from "~/lib/utils/use-bound-store";
import { UploadDropzone } from "~/lib/utils/uploadthing";
import { AspectRatio } from "../ui/aspect-ratio";
import { useState } from "react";

export function CreateAnimalListings() {
  const router = useRouter();

  const sessionUser = useBoundStore((state) => state.user);

  const [imgUrl, setimgUrl] = useState("");

  const { mutate: addAnimal, isLoading } = api.adoption.addAnimal.useMutation({
    onSuccess: () => {
      toast.success("Animal Added!");

      router.refresh();
    },

    onError: () => {
      toast.error("Something went wrong. Try again later.");
    },
  });

  const charWarning = (value: "max" | "min") => {
    if (value === "max") {
      return "Must be 30 characters or less";
    } else {
      return "Must be 3 characters or more";
    }
  };

  const formSchema = z.object({
    name: z
      .string()
      .min(3, { message: charWarning("min") })
      .max(30, { message: charWarning("max") })
      .regex(/^[a-z A-Z]+$/, "The name must contain only letters"),
    breed: z
      .string()
      .min(3, { message: charWarning("min") })
      .max(30, { message: charWarning("max") })
      .regex(/^[a-z A-Z]+$/, "Must contain only letters"),

    species: z.enum(["dog", "cat", "bird", "fish", "reptile", "other"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addAnimal({
      name: data.name,
      breed: data.breed,
      species: data.species,
      imgUrl: imgUrl,
      ownerUsername: sessionUser?.username ?? "",
    });
  };

  const speciesList = ["dog", "cat", "bird", "fish", "reptile", "other"];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container mx-auto mb-20  w-full max-w-lg space-y-8 rounded-lg border bg-white p-12"
      >
        <h1 className="text-3xl font-bold">Add Animal</h1>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Whiskers" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="species"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Species</FormLabel>
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
                    {speciesList.map((species) => (
                      <SelectItem
                        key={species}
                        className="hover:cursor-pointer"
                        value={species}
                      >
                        {species}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Breed</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!imgUrl ? (
          <UploadDropzone
            className="custom-class cursor-pointer"
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setimgUrl(res[0]?.url ?? "");
              toast.success("Image uploaded successfully!");
            }}
            onUploadError={(error: Error) => {
              toast.error(`ERROR! ${error.message}`);
            }}
            onUploadBegin={() => {
              toast.info("Uploading image...");
            }}
          />
        ) : (
          <AspectRatio ratio={16 / 9} className="mt-2 rounded-md bg-muted">
            <Image
              src={imgUrl}
              alt="post image"
              fill
              className="rounded-md object-cover"
            />
          </AspectRatio>
        )}
        <Button
          disabled={!imgUrl}
          title="submit"
          type="submit"
          className="w-full"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
