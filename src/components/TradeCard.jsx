import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'react-router-dom';
import { buyShare, getSharePrice, sellShare } from '@/api/matches';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function TradeCard({ bet, handleEventDetail }) {
  const { id } = useParams();
  const [yesPrice, setYesPrice] = useState(0);
  const [noPrice, setNoPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [noOfShares, setNoOfShares] = useState(0);
  const [betType, setBetType] = useState('buy');
  const [selectedBet, setSelectedBet] = useState(bet);

  const { currentUser } = useAuth();

  const potentialReturn = calculatePotentialReturnPercent(noOfShares);

  function handleInputChange(e) {
    const value = Number(e.target.value.replace(/[^0-9]/g, '')); // Remove non-numeric characters
    if (!isNaN(value) && value >= 0) {
      setAmount(value);
    } else if (e.target.value === '') {
      setAmount(0); // Reset to 0 if input is empty
    }
  }

  function handleShareChange(e) {
    const value = Number(e.target.value.replace(/[^0-9]/g, '')); // Remove non-numeric characters
    if (!isNaN(value) && value >= 0) {
      setNoOfShares(value);
    } else if (e.target.value === '') {
      setNoOfShares(0); // Reset to 0 if input is empty
    }
  }

  function calculatePotentialReturnPercent(share) {
    if (share === 0 || amount === 0) return '0.00';
    return Math.ceil((share / amount) * 100 - 100);
  }

  const getSharePrices = useCallback(async () => {
    try {
      const payload = {
        eventId: id,
        type: betType,
      };
      const prices = await getSharePrice(payload);
      setYesPrice(prices.yes_price);
      setNoPrice(prices.no_price);
    } catch (err) {
      toast.error('Error Occurred', err);
    }
  }, [betType, id]);

  const handleShares = useCallback(async () => {
    if (noOfShares) {
      try {
        const payload = {
          user_id: currentUser.uid,
          event_id: id,
          outcome: selectedBet,
          bet_type: betType,
          shareCount: noOfShares,
          share_price:
            selectedBet === 'yes' ? Number(yesPrice) : Number(noPrice),
          limit_price: amount,
        };
        if (betType === 'buy') {
          await buyShare(payload);
        } else {
          await sellShare(payload);
        }
        setSelectedBet('yes');
        setAmount(0);
        await handleEventDetail();
        await getSharePrices();
      } catch (err) {
        toast.error('Error Occurred', err);
      }
    }
  }, [
    amount,
    betType,
    currentUser.uid,
    getSharePrices,
    handleEventDetail,
    id,
    noOfShares,
    noPrice,
    selectedBet,
    yesPrice,
  ]);

  useEffect(() => {
    getSharePrices();
  }, [getSharePrices]);

  useEffect(() => {
    setNoOfShares(0);
    setAmount(0);
  }, [betType]);

  return (
    <Card className="mt-4 w-full border border-gray-600 bg-gray-800 text-white shadow-md">
      <Tabs className="p-1" defaultValue="buy">
        <TabsList className="mt-2 flex justify-start gap-5 rounded-none border-b border-gray-100 border-opacity-20 bg-gray-800 px-2 py-5 shadow-none">
          <TabsTrigger
            value="buy"
            onClick={() => {
              setBetType('buy');
            }}
            className="rounded-none bg-gray-800 pb-[0.6rem] text-base text-slate-400 shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-blue-400 data-[state=active]:bg-gray-800 data-[state=active]:text-blue-400"
          >
            Buy
          </TabsTrigger>
          <TabsTrigger
            value="sell"
            onClick={() => {
              setBetType('sell');
            }}
            className="rounded-none bg-gray-800 pb-[0.6rem] text-base text-slate-400 shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-blue-400 data-[state=active]:bg-gray-800 data-[state=active]:text-blue-400"
          >
            Sell
          </TabsTrigger>
        </TabsList>

        {/* Buy Tab Content */}
        <TabsContent value="buy">
          <CardContent className="p-4">
            <div className="flex flex-col items-start justify-between gap-2">
              <Label className="text-base">Outcome</Label>
              <div className="flex w-full gap-2">
                <Button
                  className={cn(
                    'group flex-1 items-center justify-center rounded-sm py-6 text-base',
                    selectedBet === 'yes'
                      ? 'bg-[#22c55e] text-white hover:bg-[#22c55e]'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-700/85'
                  )}
                  onClick={() => setSelectedBet('yes')}
                >
                  Yes {yesPrice}¢
                </Button>
                <Button
                  className={cn(
                    'group flex-1 items-center justify-center rounded-sm py-6 text-base',
                    selectedBet === 'no'
                      ? 'bg-red-600 text-white hover:bg-red-600'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-700/85'
                  )}
                  onClick={() => setSelectedBet('no')}
                >
                  No {noPrice}¢
                </Button>
              </div>
            </div>

            <div className="my-10 flex flex-col items-start justify-between gap-2">
              <Label className="text-base">Limit Price</Label>
              <div className="flex w-full items-center">
                <Button
                  className="h-12 rounded-r-none bg-gray-700 hover:bg-gray-700/85"
                  onClick={() =>
                    setAmount((prevAmount) => Math.max(0, prevAmount - 10))
                  }
                >
                  -
                </Button>
                <div className="relative flex w-full items-center bg-slate-900 text-white">
                  <span className="absolute px-2">$</span>
                  <Input
                    type="text"
                    value={amount}
                    onChange={handleInputChange}
                    className="h-12 w-full rounded-none border-none bg-slate-900 text-center text-white [appearance:textfield] focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <Button
                  className="h-12 rounded-l-none bg-slate-700 hover:bg-slate-700/85"
                  onClick={() => setAmount((prevAmount) => prevAmount + 10)}
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
                  onClick={() =>
                    setNoOfShares((prev) => {
                      if (prev) return prev - 1;
                    })
                  }
                >
                  -
                </Button>
                <div className="flex w-full items-center bg-slate-900 text-white">
                  <Input
                    type="text"
                    value={noOfShares}
                    onChange={handleShareChange}
                    className="h-12 w-full rounded-none border-none bg-slate-900 text-center text-white [appearance:textfield] focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <Button
                  className="h-12 rounded-l-none bg-slate-700 hover:bg-slate-700/85"
                  onClick={() => setNoOfShares((prev) => prev + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              className="mb-4 w-full bg-blue-500 py-5 text-base text-white hover:bg-blue-600"
              onClick={handleShares}
              disabled={!amount}
            >
              Submit
            </Button>
            <div className="text-center text-slate-400 md:text-sm xl:text-base">
              <p className="flex justify-between">
                Avg price:
                <span className="text-blue-500">
                  {selectedBet === 'yes'
                    ? yesPrice
                    : selectedBet === 'no'
                      ? noPrice
                      : 0}
                </span>
              </p>
              <p className="flex justify-between">
                Shares:
                <span className="text-slate-100">{noOfShares}</span>
              </p>
              <p className="flex justify-between">
                Potential return:
                <span className="text-green-500">{`$${noOfShares} (${potentialReturn}%)`}</span>
              </p>
            </div>
          </CardContent>
        </TabsContent>

        {/* Sell Tab Content */}
        <TabsContent value="sell">
          <CardContent className="p-4">
            <div className="flex flex-col items-start justify-between gap-2">
              <Label className="text-base">Outcome</Label>
              <div className="flex w-full gap-2">
                <Button
                  className={cn(
                    'group flex-1 items-center justify-center rounded-sm py-6 text-base',
                    selectedBet === 'yes'
                      ? 'bg-[#22c55e] text-white hover:bg-[#22c55e]'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-700/85'
                  )}
                  onClick={() => setSelectedBet('yes')}
                >
                  Yes {yesPrice}¢
                </Button>
                <Button
                  className={cn(
                    'group flex-1 items-center justify-center rounded-sm py-6 text-base',
                    selectedBet === 'no'
                      ? 'bg-red-600 text-white hover:bg-red-600'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-700/85'
                  )}
                  onClick={() => setSelectedBet('no')}
                >
                  No {noPrice}¢
                </Button>
              </div>
            </div>

            <div className="my-10 flex flex-col items-start justify-between gap-2">
              <Label className="text-base">Limit Price</Label>
              <div className="flex w-full items-center">
                <Button
                  className="h-12 rounded-r-none bg-gray-700 hover:bg-gray-700/85"
                  onClick={() =>
                    setAmount((prevAmount) => Math.max(0, prevAmount - 10))
                  }
                >
                  -
                </Button>
                <div className="relative flex w-full items-center bg-slate-900 text-white">
                  <span className="absolute px-2">$</span>
                  <Input
                    type="text"
                    value={amount}
                    onChange={handleInputChange}
                    className="h-12 w-full rounded-none border-none bg-slate-900 text-center text-white [appearance:textfield] focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <Button
                  className="h-12 rounded-l-none bg-slate-700 hover:bg-slate-700/85"
                  onClick={() => setAmount((prevAmount) => prevAmount + 10)}
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
                  onClick={() =>
                    setNoOfShares((prevAmount) => Math.max(0, prevAmount - 10))
                  }
                >
                  -
                </Button>
                <div className="flex w-full items-center bg-slate-900 text-white">
                  <Input
                    type="text"
                    value={noOfShares}
                    onChange={handleShareChange}
                    className="h-12 w-full rounded-none border-none bg-slate-900 text-center text-white [appearance:textfield] focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <Button
                  className="h-12 rounded-l-none bg-slate-700 hover:bg-slate-700/85"
                  onClick={() => setNoOfShares((prevAmount) => prevAmount + 10)}
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              className="mb-4 w-full bg-blue-500 py-5 text-base text-white hover:bg-blue-600"
              onClick={handleShares}
            >
              Submit
            </Button>
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
