import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn, splitIntoChunks } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { outcomeHeaders } from '@/lib/data';
import { DateTime } from 'luxon';

export default function PendingOutcomesTableContainer({ data, rowsPerPage }) {
  const [pageNo, setPageNo] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const currentPage = parseInt(searchParams.get('page'), 10) || 1;
    setPageNo(currentPage);
  }, [searchParams]);

  const totalTableRowsLength = data?.length || 0;
  const perPageData = splitIntoChunks(data || [], rowsPerPage);
  const currentData = perPageData[pageNo - 1] || [];

  // RESULTS TO SHOW IN TABLE
  const startResult = (pageNo - 1) * rowsPerPage + 1;
  const endResult = Math.min(totalTableRowsLength, pageNo * rowsPerPage);

  function setPageNoParams(newPageNo) {
    if (newPageNo < 1 || newPageNo > perPageData.length) return;
    setPageNo(newPageNo);
    setSearchParams({
      page: newPageNo.toString(),
      search: searchParams.get('search') || '',
    });
  }

  const generatePaginationItems = () => {
    const totalPages = perPageData.length;
    const paginationItems = [];

    let startPage = Math.max(1, pageNo - 3);
    let endPage = Math.min(totalPages, pageNo + 3);

    if (endPage - startPage < 6) {
      if (startPage === 1) {
        endPage = Math.min(7, totalPages);
      } else {
        startPage = Math.max(1, endPage - 6);
      }
    }

    if (startPage > 1) {
      paginationItems.push(1);
      if (startPage > 2) {
        paginationItems.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationItems.push('...');
      }
      paginationItems.push(totalPages);
    }

    return paginationItems;
  };
  return (
    <div className="overflow-hidden rounded-md border">
      <Table className="cursor-pointer">
        <TableHeader className="h-16">
          <TableRow className="text-nowrap bg-indigo-600 hover:bg-indigo-500">
            {outcomeHeaders.map((header, index) => (
              <TableHead
                key={index}
                className={cn('h-14 pl-4 font-semibold text-white', {
                  'text-center': index !== 0,
                })}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((row, index) => (
            <TableRow
              key={index}
              className="h-16 text-nowrap border-b last:border-b-0"
            >
              <TableCell className="pl-4 font-medium">
                <p className="font-semibold text-gray-500">{row.question}</p>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center justify-center gap-5">
                  <div className="flex flex-col items-center">
                    <p>{row.team1}</p>
                  </div>
                  <p className="text-lg font-bold">VS</p>
                  <div className="flex flex-col items-center">
                    <p>{row.team2}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="space-y-2 text-center">
                <p className="font-semibold text-gray-600">
                  {DateTime.fromISO(
                    new Date(row.bet_end_time).toISOString()
                  ).toLocaleString(DateTime.DATETIME_MED)}
                </p>
              </TableCell>
              <TableCell className="text-center">{row.total_bets}</TableCell>
              <TableCell className="text-center">
                <span
                  className={cn(
                    'text-xsm rounded-full px-3 py-[0.5px]',
                    !row.resolved
                      ? 'border border-yellow-600 bg-yellow-100 text-yellow-800'
                      : 'border border-teal-700 bg-teal-100 text-teal-800'
                  )}
                >
                  {!row.resolved ? 'Pending...' : 'Resolved'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex w-full items-center justify-between px-10 py-10">
        <p className="text-sm">
          Showing{' '}
          <span className="text-md font-bold text-gray-500">
            {startResult}{' '}
          </span>
          to{' '}
          <span className="text-md font-bold text-gray-500">{endResult}</span>{' '}
          of{' '}
          <span className="text-md font-bold text-gray-500">
            {totalTableRowsLength}
          </span>{' '}
          results
        </p>
        <div>
          <Pagination className="cursor-pointer">
            <PaginationContent className="space-x-4">
              <PaginationItem
                className="rounded-sm border"
                onClick={() => setPageNoParams(pageNo - 1)}
                disabled={pageNo === 1}
              >
                <PaginationPrevious />
              </PaginationItem>
              {generatePaginationItems().map((item, index) => (
                <PaginationItem key={index}>
                  {typeof item === 'number' ? (
                    <PaginationLink
                      className={cn('rounded-sm border', {
                        'bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white':
                          item === pageNo,
                      })}
                      onClick={() => setPageNoParams(item)}
                    >
                      {item}
                    </PaginationLink>
                  ) : (
                    <PaginationEllipsis />
                  )}
                </PaginationItem>
              ))}
              <PaginationItem
                className={cn('rounded-sm border', {
                  'cursor-not-allowed opacity-50': pageNo >= perPageData.length,
                })}
                onClick={() => setPageNoParams(pageNo + 1)}
                disabled={pageNo >= perPageData.length}
              >
                <PaginationNext />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
