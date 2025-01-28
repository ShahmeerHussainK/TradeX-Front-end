import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';
function CurrentMatchesTable({ data }) {
  const navigate = useNavigate();
  return (
    <div className="overflow-hidden">
      {data?.map((row) => (
        <div
          key={row.id}
          onClick={() => {
            navigate(`/events/${row.id}?isLive=true`);
          }}
          className="h-10 w-full cursor-pointer text-nowrap border-b last:border-b-0 hover:bg-white hover:text-black"
        >
          <div className="flex flex-col">
            <p className="text-sm font-bold">
              {row.team1} v {row.team2}
            </p>
            <div className="text-end">
              <p className="align-end text-sm">
                {DateTime.fromISO(row.match_time).toLocaleString(
                  DateTime.TIME_SIMPLE
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CurrentMatchesTable;
