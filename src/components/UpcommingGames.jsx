import { getAdminMatches } from '@/api/matches';
import CustomizeableButton from '@/components/CustomizeableButton';
import GamesContainerTable from '@/components/GamesContainerTable';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CiFilter } from 'react-icons/ci';

export default function UpcommingGames() {
  const [matches, setMatches] = useState([]);
  const handleGetMatches = async () => {
    try {
      const list = await getAdminMatches();

      const filteredList = list.filter((item) => {
        const date = DateTime.fromISO(item?.match_time);
        const now = DateTime.local();

        return date.toFormat('d') > now.toFormat('d');
      });
      if (filteredList.length) setMatches(filteredList);
    } catch (err) {
      toast.error('error occured', err);
    }
  };

  useEffect(() => {
    handleGetMatches();
  }, []);
  return (
    <div className="space-y-8 p-10 px-12">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold text-gray-600">Upcomming Games</h3>
        <div className="flex gap-3">
          <CustomizeableButton
            icon={<CiFilter />}
            label="Filter"
            onClick={() => console.log('Data Filtered')}
          />
        </div>
      </div>

      <div className="bg-white">
        <GamesContainerTable data={matches ?? []} rowsPerPage={10} />
      </div>
    </div>
  );
}
