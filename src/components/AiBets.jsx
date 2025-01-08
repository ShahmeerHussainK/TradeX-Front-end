import { getAiBets } from '@/api/matches';
import ManageBetsTableContainer from '@/components/ManageBetsTableContainer';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AiBets() {
  const [betsList, setBetsList] = useState([]);

  const getBets = useCallback(async () => {
    try {
      const data = await getAiBets();
      setBetsList(
        data.map((item) => ({
          team1: item.team1,
          team2: item.team2,
          league: item.league,
          type: item.bet_type,
          outcome: item.outcome,
          noOfShares: item.number_of_shares,
          betTime: DateTime.fromISO(
            new Date(item.bet_time).toISOString()
          ).toLocaleString(DateTime.DATETIME_MED),
        }))
      );
    } catch (err) {
      toast.error(err);
    }
  }, []);

  useEffect(() => {
    getBets();
  }, [getBets]);

  return (
    <div className="space-y-10 px-6 py-12">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-700">AI Bets</h3>
      </div>
      <div className="bg-white">
        <ManageBetsTableContainer data={betsList} rowsPerPage={10} />
      </div>
    </div>
  );
}
