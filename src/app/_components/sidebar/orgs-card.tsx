import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { toast } from "sonner";

export const OrgsCard = () => {
  const orgs = [
    {
      title: "Pawssion Project",
      description:
        "A non-profit organization that rescues and rehabilitates dogs.",
    },

    {
      title: "PAWS",
      description:
        "Rescues and rehabilitates animals in distress, and provides shelter and food for abandoned animals.",
    },

    {
      title: "CARA",
      description:
        "Cares for the welfare of animals through sheltering, adoption, education, and advocacy.",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Organizations you might be interested in
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {orgs.map((org) => {
          const { title, description } = org;
          return (
            <div key={title} className="flex cursor-pointer gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-xs">
                  {title?.split(" ").at(0)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-3">
                <div>
                  <h4 className="text-md font-semibold text-foreground">
                    {title}
                  </h4>
                  <h4 className="line-clamp-1 text-ellipsis text-sm font-normal text-muted-foreground">
                    {description}
                  </h4>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button onClick={() => toast.info("Coming soon!")} className="w-full">
          See All
        </Button>
      </CardFooter>
    </Card>
  );
};
