import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

interface TableSkeletonProps {
  rowCount?: number;
  columns?: number;
}

const TableSkeleton = ({ rowCount = 8, columns = 5 }: TableSkeletonProps) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {Array.from({ length: columns }).map((_, i) => (
            <TableCell key={i}>
              <Skeleton variant="text" width={i === 0 ? 140 : 100} height={20} />
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                {colIndex === 0 ? (
                  <Skeleton
                    variant="rounded"
                    width={32}
                    height={32}
                    sx={{ display: 'inline-block', mr: 1.5, verticalAlign: 'middle' }}
                  />
                ) : null}
                <Skeleton
                  variant="text"
                  width={colIndex === 0 ? 110 : colIndex === 1 ? 160 : 80}
                  height={18}
                  sx={{ display: 'inline-block', verticalAlign: 'middle' }}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableSkeleton;
