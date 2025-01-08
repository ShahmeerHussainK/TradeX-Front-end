import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useParams } from 'react-router-dom';
import { buyShare, getSharePrice, sellShare } from '@/api/matches';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';

const BuySellForm = ({ betType, handleEventDetail }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [betPrice, setBetPrice] = useState({ yes: 0, no: 0 });
  const [outcome, setOutcome] = useState('yes');

  const { register, reset, setValue, getValues, handleSubmit, formState } =
    useForm({
      defaultValues: {
        limit: 0,
        shares: 0,
      },
      mode: 'onSubmit',
    });

  const getSharePrices = useCallback(async () => {
    try {
      const payload = {
        eventId: id,
        type: betType,
      };
      const prices = await getSharePrice(payload);
      setBetPrice({ yes: prices.yes_price, no: prices.no_price });
    } catch (err) {
      toast.error('Error Occurred', err);
    }
  }, [betType, id]);

  const handleLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const onSubmit = useCallback(
    async (values) => {
      if (currentUser && values.shares) {
        try {
          const payload = {
            user_id: currentUser?.uid,
            event_id: id,
            outcome: outcome,
            bet_type: betType,
            shareCount: values.shares,
            share_price:
              values?.outcome === 'yes'
                ? Number(betPrice?.yes)
                : Number(betPrice?.no),
            limit_price: values.limit,
          };
          if (betType === 'buy') {
            await buyShare(payload);
          } else {
            await sellShare(payload);
          }
          await handleEventDetail();
          await getSharePrices();
          reset();
        } catch (err) {
          toast.error('Error Occurred', err);
        }
      } else {
        toast.error('Shares are required');
      }
    },
    [
      betPrice?.no,
      betPrice?.yes,
      betType,
      currentUser,
      getSharePrices,
      handleEventDetail,
      id,
      reset,
      outcome,
    ]
  );

  useEffect(() => {
    getSharePrices();
  }, [getSharePrices]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-start justify-between gap-2">
        <Label className="text-base">Outcome</Label>
        <div className="flex w-full gap-2">
          <Button
            className={cn(
              'group flex-1 items-center justify-center rounded-sm py-6 text-base',
              outcome === 'yes'
                ? 'bg-[#22c55e] text-white hover:bg-[#22c55e]'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-700/85'
            )}
            type="button"
            onClick={() => {
              setOutcome('yes');
            }}
          >
            Yes {betPrice?.yes}¢
          </Button>
          <Button
            className={cn(
              'group flex-1 items-center justify-center rounded-sm py-6 text-base',
              outcome === 'no'
                ? 'bg-red-600 text-white hover:bg-red-600'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-700/85'
            )}
            type="button"
            onClick={() => {
              setOutcome('no');
            }}
          >
            No {betPrice?.no}¢
          </Button>
        </div>
      </div>

      <div className="my-10 flex flex-col items-start justify-between gap-2">
        <Label className="text-base">Limit Price</Label>
        <div className="flex w-full items-center">
          <Button
            className="h-12 rounded-r-none bg-gray-700 hover:bg-gray-700/85"
            type="button"
            onClick={() => {
              const limitNum = Number(getValues().limit);
              setValue(
                'limit',
                limitNum > 10
                  ? limitNum - 10
                  : limitNum > 0
                    ? limitNum - 1
                    : limitNum,
                { shouldDirty: 'true' }
              );
            }}
          >
            -
          </Button>
          <div className="relative flex w-full items-center bg-slate-900 text-white">
            <span className="absolute px-2">$</span>
            <Input
              type="text"
              {...register('limit')}
              className="h-12 w-full rounded-none border-none bg-slate-900 text-center text-white [appearance:textfield] focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <Button
            className="h-12 rounded-l-none bg-slate-700 hover:bg-slate-700/85"
            type="button"
            onClick={() => {
              const limitNum = Number(getValues().limit);
              setValue('limit', limitNum + 10, { shouldDirty: 'true' });
            }}
          >
            +
          </Button>
        </div>
      </div>
      <div className="my-10 flex flex-col items-start justify-between gap-2">
        <Label className="text-base">Shares</Label>
        <div className="flex w-full items-center">
          <Button
            className="h-12 rounded-r-none bg-gray-700 hover:bg-gray-700/85"
            type="button"
            onClick={() => {
              const sharesNum = Number(getValues().shares);
              setValue(
                'shares',
                sharesNum >= 10
                  ? sharesNum - 10
                  : sharesNum > 0
                    ? sharesNum - 1
                    : sharesNum,
                { shouldDirty: 'true' }
              );
            }}
          >
            -
          </Button>
          <div className="flex w-full items-center bg-slate-900 text-white">
            <Input
              type="text"
              {...register('shares', {
                required: true,
              })}
              className="h-12 w-full rounded-none border-none bg-slate-900 text-center text-white [appearance:textfield] focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <Button
            className="h-12 rounded-l-none bg-slate-700 hover:bg-slate-700/85"
            type="button"
            onClick={() => {
              const sharesNum = Number(getValues().shares);
              setValue('shares', sharesNum + 10, { shouldDirty: 'true' });
            }}
          >
            +
          </Button>
        </div>
      </div>
      {currentUser ? (
        <Button
          className="mb-4 w-full bg-blue-500 py-5 text-base text-white hover:bg-blue-600"
          type="submit"
          disabled={!formState.isDirty}
        >
          Submit
        </Button>
      ) : (
        <Button
          className="mb-4 w-full bg-blue-500 py-5 text-base text-white hover:bg-blue-600"
          type="button"
          onClick={handleLogin}
        >
          Login
        </Button>
      )}
    </form>
  );
};

export default function TradeCard({ handleEventDetail }) {
  const potentialReturn = 0;

  return (
    <Card className="mt-4 w-full border border-gray-600 bg-gray-800 text-white shadow-md">
      <Tabs className="p-1" defaultValue="buy">
        <TabsList className="mt-2 flex justify-start gap-5 rounded-none border-b border-gray-100 border-opacity-20 bg-gray-800 px-2 py-5 shadow-none">
          <TabsTrigger
            value="buy"
            className="rounded-none bg-gray-800 pb-[0.6rem] text-base text-slate-400 shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-blue-400 data-[state=active]:bg-gray-800 data-[state=active]:text-blue-400"
          >
            Buy
          </TabsTrigger>
          <TabsTrigger
            value="sell"
            className="rounded-none bg-gray-800 pb-[0.6rem] text-base text-slate-400 shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-blue-400 data-[state=active]:bg-gray-800 data-[state=active]:text-blue-400"
          >
            Sell
          </TabsTrigger>
        </TabsList>

        {/* Buy Tab Content */}
        <TabsContent value="buy">
          <CardContent className="p-4">
            <BuySellForm betType="buy" handleEventDetail={handleEventDetail} />
            <div className="text-center text-slate-400 md:text-sm xl:text-base">
              <p className="flex justify-between">
                Avg price:
                <span className="text-blue-500">{0}</span>
              </p>
              <p className="flex justify-between">
                Shares:
                <span className="text-slate-100">{0}</span>
              </p>
              <p className="flex justify-between">
                Potential return:
                <span className="text-green-500">{`$${0} (${potentialReturn}%)`}</span>
              </p>
            </div>
          </CardContent>
        </TabsContent>

        {/* Sell Tab Content */}
        <TabsContent value="sell">
          <CardContent className="p-4">
            <BuySellForm betType="sell" handleEventDetail={handleEventDetail} />
            <div className="text-center text-slate-400 md:text-sm xl:text-base">
              <p className="flex justify-between">
                Avg price: <span className="text-blue-400">0.0¢</span>
              </p>
              <p className="flex justify-between">
                Est. amount received:
                <span className="text-slate-100">$0.00</span>
              </p>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
