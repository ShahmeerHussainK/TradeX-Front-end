import { getOutcomes } from '@/api/matches';
import PendingOutcomesTableContainer from '@/components/PendingOutcomesTableContainer';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function PendingOutcomes() {
  const [outcomes, setOutcomes] = useState(null);

  const handleGetOutcomesData = useCallback(async () => {
    try {
      const data = await getOutcomes();
      if (data) setOutcomes(data.filter((item) => !item.resolved));
    } catch (err) {
      toast.error(err);
    }
  }, []);

  useEffect(() => {
    handleGetOutcomesData();
  }, [handleGetOutcomesData]);

  return (
    <div className="space-y-10 px-6 py-12">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-700">Pending Outcomes</h3>
      </div>
      <div className="bg-white">
        <PendingOutcomesTableContainer data={outcomes} rowsPerPage={10} />
      </div>
    </div>
  );
}
