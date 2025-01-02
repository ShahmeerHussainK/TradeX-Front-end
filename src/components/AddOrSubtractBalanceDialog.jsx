import { useCallback, useState } from 'react';
import { FiPlusCircle, FiMinusCircle } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { addSubUserBalance } from '@/api/users';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function AddOrSubtractBalanceDialog({ type, getUserDetails }) {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const { handleSubmit, register } = useForm({
    defaultValues: {
      amount: 0,
      type: type === 'Add' ? 'addBalance' : 'subBalance',
      message: '',
    },
  });

  const handleUpdateBalance = useCallback(
    async (values) => {
      try {
        await addSubUserBalance({
          ...values,
          amount: Number(values.amount),
          user_id: id,
        });
        await getUserDetails(id);
        setIsOpen(false);
      } catch (err) {
        if (err.status === 400)
          toast.error('Amount is too large it cannot be subtracted');
      }
    },
    [id, getUserDetails]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            'flex-grow transform rounded-sm py-5 text-base font-normal text-white shadow-none transition-transform duration-300 hover:-translate-y-[2px] hover:shadow-lg 2xl:h-16',
            {
              'bg-green-500 hover:bg-green-500 hover:shadow-green-500/20':
                type === 'Add',
              'bg-red-500 hover:bg-red-500 hover:shadow-red-500/20':
                type === 'Subtract',
            }
          )}
        >
          {type === 'Add' ? (
            <FiPlusCircle className="mt-[2px]" />
          ) : (
            <FiMinusCircle className="mt-[2px]" />
          )}
          Balance
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0 py-4 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="px-6 text-gray-700">
            {type} Balance
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <form noValidate onSubmit={handleSubmit(handleUpdateBalance)}>
          <div className="grid gap-4 px-6 py-4">
            <div className="flex items-center">
              <Label htmlFor="amount" className="text-right">
                Amount <span className="text-red-500">*</span>
              </Label>
            </div>
            <div className="flex w-full items-center">
              <Input
                id="amount"
                type="number"
                min="0"
                required
                placeholder="Please enter positive amount"
                className="h-10 w-full rounded-r-none focus-visible:ring-0"
                {...register('amount')}
              />
              <span className="flex h-10 items-center rounded-md rounded-l-none border border-gray-300 bg-gray-200 px-2">
                USD
              </span>
            </div>
            <div className="flex items-center">
              <Label htmlFor="remarks" className="text-right">
                Remarks <span className="text-red-500">*</span>
              </Label>
            </div>
            <div>
              <Textarea
                id="remarks"
                rows="4"
                required
                placeholder="Enter remarks here"
                className="w-full rounded-md border p-2 focus-visible:ring-0"
                {...register('message')}
              />
            </div>
          </div>
          <Separator />
          <DialogFooter className="px-6">
            <Button
              type="submit"
              className="flex-grow bg-blue-700 py-5 hover:bg-blue-600"
            >
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
