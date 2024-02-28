import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";

export const EventsCard = () => {
  const events = [
    {
      title: "Neutering Drive",
      description:
        "A drive to neuter stray animals in the city. Volunteers needed.",
    },

    {
      title: "Adoption Day",
      description:
        "An event to find homes for the animals in the shelter. Volunteers needed.",
    },

    {
      title: "Fundraising Event",
      description:
        "A charity event to raise funds for the welfare of animals. Volunteers needed.",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Active Events</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {events.map((org) => {
          const { title, description } = org;
          return (
            <div key={title} className="flex gap-3">
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

              <Button
                onClick={() => toast.info("Coming soon!")}
                variant="secondary"
              >
                Details
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
