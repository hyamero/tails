import Image from "next/image";
import { api } from "~/trpc/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { AspectRatio } from "../ui/aspect-ratio";

export function AnimalListings({ owner }: { owner: string }) {
  const animals = api.adoption.getAnimals.useQuery({
    ownerUsername: owner,
  });

  return (
    <div className="w-full space-y-3">
      {animals.data?.map((animal) => (
        <Card key={animal.id}>
          <CardHeader>
            <CardTitle>{animal.name}</CardTitle>
            <CardDescription>
              Sheltered by @{animal.ownerUsername}
              {animal.breed}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AspectRatio ratio={16 / 9} className="my-3 rounded-md bg-muted">
              <Image
                src={animal.imgUrl!}
                alt="post image"
                fill
                className="rounded-md object-cover"
              />
            </AspectRatio>
          </CardContent>
          <CardFooter>
            {animal.species} · {animal.breed}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
