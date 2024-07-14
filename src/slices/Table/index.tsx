import { Card } from "@/app/_components/ui/card";
import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Table`.
 */
export type TableProps = SliceComponentProps<Content.TableSlice>;

/**
 * Component for "Table" Slices.
 */
const Table = ({ slice }: TableProps): JSX.Element => {
  const header = slice.primary.rows[0];
  if (!header) return <div>No table data provided</div>;

  return (
    <Card.Container
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mx-auto mt-5 max-w-3xl"
    >
      <ShadTable className="">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3 px-4 py-2 text-left">
              {header.col1}
            </TableHead>
            <TableHead className="w-2/3 px-4 py-2 text-left">
              {header.col2}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slice.primary.rows.slice(1).map((row, index) => (
            <TableRow key={index}>
              <TableCell className="px-4 py-3">
                <div className="font-medium">{row.col1}</div>
              </TableCell>
              <TableCell className="px-4 py-3">
                <div>{row.col2}</div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </ShadTable>
    </Card.Container>
  );
};

export default Table;
