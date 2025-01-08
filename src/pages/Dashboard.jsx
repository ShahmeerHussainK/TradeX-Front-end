import DepositAndWithdrawReportChart from '@/components/DepositAndWithdrawReportChart';
import TransactionsReportChart from '@/components/TransactionsReportChart';
import NumbersCard from '@/components/NumbersCard';
import { useState } from 'react';
import { AiOutlineMail } from 'react-icons/ai';
import { BiMessage } from 'react-icons/bi';
import { IoIosPeople } from 'react-icons/io';
import { IoPeopleOutline } from 'react-icons/io5';
import { Calendar, Copy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import axiosInstance from '@/api/axios';

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      'curl -s http://localhost:8000/api/scrape_and_store_matches'
    );
  };

  const handleCron = async () => {
    const result = await axiosInstance.get('/api/scrape_and_store_matches');
    return result.data;
  };

  return (
    <div className="space-y-10 p-4 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-indigo-950">Dashboard</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="border border-indigo-600 bg-gray-100 text-indigo-800 hover:bg-indigo-800 hover:text-indigo-50">
              Open Cron Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                <DialogTitle className="text-xl font-semibold text-slate-700">
                  Please Set Cron Job
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <DialogDescription className="text-muted-foreground">
                Once per 5-10 minutes is ideal while once every minute is the
                best option
              </DialogDescription>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Cron Command</h3>
                  <span className="text-muted-foreground">
                    Last Cron Run: 1 day ago
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                  <code className="text-sm">
                    curl -s http://localhost:8000/api/scrape_and_store_matches
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-500 hover:text-indigo-600"
                    onClick={handleCopy}
                  >
                    <Copy className="mr-1 h-4 w-4" />
                    Copy
                  </Button>
                </div>

                <div className="flex">
                  <Button
                    variant="outline"
                    onClick={handleCron}
                    className="flex-1 border-orange-400 text-orange-400 hover:bg-orange-50"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Run Manually
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
        <NumbersCard
          title="Total Bettors"
          totalBettors={3431}
          icon={<IoIosPeople />}
          textColor="text-indigo-600"
          iconBgColor="bg-indigo-100"
          borderColor="border border-indigo-700"
          border={true}
        />
        <NumbersCard
          title="Active Bettors"
          totalBettors={3430}
          icon={<IoPeopleOutline />}
          textColor="text-green-600"
          iconBgColor="bg-green-100"
          borderColor="border border-green-700"
          border={true}
        />
        <NumbersCard
          title="Email Unverified Bettors"
          totalBettors={0}
          icon={<AiOutlineMail />}
          textColor="text-red-600"
          iconBgColor="bg-red-100"
          borderColor="border border-red-700"
          border={true}
        />
        <NumbersCard
          title="Mobile Unverified Bettors"
          totalBettors={0}
          icon={<BiMessage />}
          textColor="text-orange-600"
          iconBgColor="bg-orange-100"
          borderColor="border border-orange-500"
          border={true}
        />
      </div>
      <div className="grid grid-cols-1 gap-2 2xl:grid-cols-2">
        <div className="space-y-3 rounded-md bg-white p-4">
          <h2 className="text-xl font-bold text-indigo-950">Deposits</h2>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            <div className="border-b border-r border-gray-200">
              <NumbersCard
                title="Total Deposited"
                totalBettors={87332}
                icon={<BiMessage />}
                textColor="text-orange-600"
                iconBgColor="bg-orange-100"
                hover={true}
                hoverEffect="hover:bg-gray-50"
              />
            </div>
            <div className="border-b border-gray-200">
              <NumbersCard
                title="Pending Deposits"
                totalBettors={59}
                icon={<BiMessage />}
                textColor="text-orange-600"
                iconBgColor="bg-orange-100"
                hover={true}
                hoverEffect="hover:bg-gray-50"
              />
            </div>
            <div className="border-b border-r border-gray-200">
              <NumbersCard
                title="Rejected Deposits"
                totalBettors={0}
                icon={<BiMessage />}
                textColor="text-orange-600"
                iconBgColor="bg-orange-100"
                hover={true}
                hoverEffect="hover:bg-gray-50"
              />
            </div>
            <div className="border-b border-gray-200">
              <NumbersCard
                title="Deposited Charge"
                totalBettors={835.9}
                icon={<BiMessage />}
                textColor="text-orange-600"
                iconBgColor="bg-orange-100"
                hover={true}
                hoverEffect="hover:bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-md bg-white p-4">
          <h2 className="text-xl font-bold text-indigo-950">Withdrawals</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="border-b border-r border-gray-200">
              <NumbersCard
                title="Total Withdrawn"
                totalBettors={3000}
                icon={<BiMessage />}
                textColor="text-orange-600"
                iconBgColor="bg-orange-100"
                hover={true}
                hoverEffect="hover:bg-gray-50"
              />
            </div>
            <div className="border-b border-gray-200">
              <NumbersCard
                title="Pending Withdrawals"
                totalBettors={49}
                icon={<BiMessage />}
                textColor="text-orange-600"
                iconBgColor="bg-orange-100"
                hover={true}
                hoverEffect="hover:bg-gray-50"
              />
            </div>
            <div className="border-b border-r border-gray-200">
              <NumbersCard
                title="Rejected Withdrawals"
                totalBettors={1}
                icon={<BiMessage />}
                textColor="text-orange-600"
                iconBgColor="bg-orange-100"
                hover={true}
                hoverEffect="hover:bg-gray-50"
              />
            </div>
            <div className="border-gray-20 border-b">
              <NumbersCard
                title="Withdrawal Charge"
                totalBettors={21.2}
                icon={<BiMessage />}
                textColor="text-orange-600"
                iconBgColor="bg-orange-100"
                hover={true}
                hoverEffect="hover:bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
        <NumbersCard
          title="Pending Bet"
          totalBettors={514}
          icon={<IoIosPeople />}
          textColor="text-indigo-600"
          iconBgColor="bg-indigo-100"
          borderColor="border border-indigo-700"
        />
        <NumbersCard
          title="Pending Deposits"
          totalBettors={59}
          icon={<IoPeopleOutline />}
          textColor="text-green-600"
          iconBgColor="bg-green-100"
          borderColor="border border-green-700"
        />
        <NumbersCard
          title="Pending Withdrawls"
          totalBettors={0}
          icon={<AiOutlineMail />}
          textColor="text-red-600"
          iconBgColor="bg-red-100"
          borderColor="border border-red-700"
        />
        <NumbersCard
          title="Pending Tickets"
          totalBettors={49}
          icon={<BiMessage />}
          textColor="text-orange-600"
          iconBgColor="bg-orange-100"
          borderColor="border border-orange-500"
        />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <DepositAndWithdrawReportChart />
        <TransactionsReportChart />
      </div>
    </div>
  );
}
