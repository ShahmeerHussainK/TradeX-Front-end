import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { basketballLiveHeaders } from '@/lib/data';
function MatchLiveResults() {
  const data = [
    { team: 'Team1', q1: 2, q2: 4, q3: 6, q4: 8, score: 20 },
    { team: 'Team2', q1: 3, q2: 5, q3: 7, q4: 9, score: 24 },
  ];

  return (
    <div>
      <div className="flex flex-row justify-center pb-5 text-2xl font-bold">
        <p>{data[0].team}</p>&nbsp;&nbsp;
        <p>vs</p>&nbsp;&nbsp;
        <p>{data[1].team}</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="text-nowrap bg-gray-500 hover:bg-gray-500">
            {basketballLiveHeaders.map((header, index) => (
              <TableHead key={index} className="h-10 font-semibold text-white">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((row) => (
            <TableRow
              key={row.id}
              className="h-15 text-nowrap border-b last:border-b-0 hover:bg-white hover:text-black"
            >
              <TableCell>
                <p>{row.team}</p>
              </TableCell>
              <TableCell>
                <p>{row.score}</p>
              </TableCell>
              <TableCell>
                <p>{`${row.q1 ?? ' - '}`}</p>
              </TableCell>
              <TableCell>
                <p>{`${row.q2 ?? ' - '}`}</p>
              </TableCell>
              <TableCell>
                <p>{`${row.q3 ?? ' - '}`}</p>
              </TableCell>
              <TableCell>
                <p>{`${row.q4 ?? ' - '}`}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default MatchLiveResults;
