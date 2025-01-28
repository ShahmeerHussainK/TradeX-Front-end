import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { matchEventsTableHeader } from '@/lib/data';
import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';

function MatchEventsAccordionTable({ data }) {
  const navigate = useNavigate();
  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="text-nowrap bg-gray-500 hover:bg-gray-500">
            {matchEventsTableHeader.map((header, index) => (
              <TableHead key={index} className="h-5 font-semibold text-white">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => navigate(`/event/${row.id}`)}
              className="h-8 cursor-pointer text-nowrap border-b last:border-b-0 hover:bg-white hover:text-black"
            >
              <TableCell>
                <p>{row.question}</p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-5">
                  <div className="flex flex-col items-center">
                    <p>{row.team1}</p>
                  </div>
                  <p className="text-lg font-bold">VS</p>
                  <div className="flex flex-col items-center">
                    <p>{row.team2}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p>
                  {row.buy_yes_price}&nbsp;&nbsp;-&nbsp;&nbsp;
                  {row.sell_yes_price}
                </p>
              </TableCell>

              <TableCell>
                <p>
                  {row.buy_no_price}&nbsp;&nbsp;-&nbsp;&nbsp;
                  {row.sell_no_price}
                </p>
              </TableCell>

              <TableCell>
                {DateTime.fromISO(row.match_time).toLocaleString(
                  DateTime.DATETIME_MED
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default MatchEventsAccordionTable;
