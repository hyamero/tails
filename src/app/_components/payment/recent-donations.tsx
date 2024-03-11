import { api } from "~/trpc/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ProfileHoverCard } from "../profile/profile-hovercard";

export function RecentDonations({ recipient }: { recipient: string | null }) {
  const donations = api.transaction.getDonations.useQuery({
    recipient: recipient!,
  });

  function totalAmount() {
    let sum = 0;

    donations.data?.forEach((d) => {
      sum += d.amount;
    });

    return sum;
  }

  return (
    <Table className="rounded-md bg-background">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Donor</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {donations.data?.map((donation, i) => {
          const { id, amount, createdAt, donor } = donation;

          return (
            <ProfileHoverCard key={id} userId="" author={donor}>
              <TableRow>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                    </TooltipTrigger>
                    <TooltipContent>{id}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TableCell>{format(createdAt, "MM/dd/yyyy")}</TableCell>
                <TableCell>{donor.username}</TableCell>
                <TableCell className="text-right">₱{amount}</TableCell>
              </TableRow>
            </ProfileHoverCard>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">₱{totalAmount()}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
