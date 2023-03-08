import { useEffect, useMemo, useRef, useState } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { parseISO, formatDistanceToNowStrict } from "date-fns";

import Toast from "./Toast";
import Buttons from "./Buttons";
import Pagination from "./Pagination";

export default function Table({ data, total, refetch, loading, ids, setIds }) {
  const [count, setCount] = useState(0);

  const columns = useMemo(
    () => [
      {
        id: "selection",
        Header: ({ rows, isAllPageRowsSelected, toggleAllPageRowsSelected }) => (
          <input type="checkbox"
            disabled={!data}
            checked={isAllPageRowsSelected}
            onChange={e => {
              toggleAllPageRowsSelected(e.target.checked);
              if (e.target.checked)
                setIds(ids => rows.map(row => row.values.user_id));
              else
                setIds(ids => []);
            }}
            aria-label={(isAllPageRowsSelected ? "Uns" : "S") + "elect all users"}
          />
        ),
        Cell: ({ row }) => (
          <input type="checkbox"
            checked={row.isSelected}
            onChange={e => {
              row.toggleRowSelected(e.target.checked);
              if (e.target.checked)
                setIds(ids => [...ids, row.values.user_id]);
              else
                setIds(ids => ids.filter(id => id !== row.values.user_id));
            }}
            aria-label={(row.isSelected ? "Uns" : "S") + "elect this user"}
          />
        )
      },
      {
        Header: "ID",
        accessor: "user_id"
      },
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Email",
        accessor: "email"
      },
      {
        Header: "Registered",
        accessor: "created_at",
        Cell: ({ value }) => formatDistanceToNowStrict(
          parseISO(value), { addSuffix: true })
      },
      {
        Header: "Last seen",
        accessor: "last_login",
        Cell: ({ value }) => value ? formatDistanceToNowStrict(
          parseISO(value), { addSuffix: true }) : "Never"
      },
      {
        Header: "Status",
        accessor: "blocked",
        Cell: ({ value }) => value ? "Blocked" : "Active"
      }
    ],
    // eslint-disable-next-line
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    isAllPageRowsSelected,
    toggleRowSelected,
    toggleAllPageRowsSelected,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: count
    },
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    refetch({ params: { page: pageIndex } }).catch(() => null);
  }, [pageIndex]);
  useEffect(() => {
    setCount(Math.ceil(total / pageSize));
    setIds([]);
  }, [page]);

  const [toast, setToast] = useState(null);
  const toastRef = useRef(null);
  useEffect(() => {
    setToast(new window.bootstrap.Toast(toastRef.current));
  }, [toastRef]);

  return (<>
    <Toast ref={toastRef} />
    <Buttons ids={ids} toast={toast} page={pageIndex} refetch={refetch} />
    <div className="table-responsive flex-grow-1">
      <table {...getTableProps()} className="table table-hover" data-bs-theme="light">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps({ scope: "col" })}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="table-group-divider">
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps({ scope: "row" })}
                className={row.isSelected ? "table-active" : undefined}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
    <Pagination pageIndex={pageIndex}
                canPreviousPage={canPreviousPage}
                previousPage={previousPage}
                canNextPage={canNextPage}
                nextPage={nextPage}
                loading={loading}
    />
  </>);
}
