import { PaymentMethod } from "~/app/_components/payment/payment-method";

export default async function Page() {
  return (
    <div className="grid place-items-center pt-20">
      <PaymentMethod />
    </div>
  );
}
