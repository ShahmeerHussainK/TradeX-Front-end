import { Button } from "@/components/ui/button";

export default function DepositWithDrawBtn() {
  return (
    <div className="flex w-full flex-col items-center gap-2 sm:flex-row">
      <Button className="w-full flex-grow bg-sky-700 transition-all hover:bg-sky-800 sm:w-auto">
        Deposit
      </Button>
      <Button className="w-full flex-grow bg-red-700 transition-all hover:bg-red-800 sm:w-auto">
        Withdraw
      </Button>
    </div>
  );
}