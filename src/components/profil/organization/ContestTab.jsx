import React from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import { format, parseISO } from "date-fns";
import { RiSortAsc, RiSortDesc } from "react-icons/ri";

const ContestTab = (organization) => {
    const columns = React.useMemo(() => {
          return [
            { Header: 'Nom du concours', accessor: 'name' },
            {
              Header: 'Début',
              accessor: 'creationDate',
              Cell: ({ value }) => {
                const formattedDate = format(parseISO(value), 'dd/MM/yyyy');
                return <span>{formattedDate}</span>;
              },
            },
            {
              Header: 'Fin',
              accessor: 'resultsDate',
              Cell: ({ value }) => {
                const formattedDate = format(parseISO(value), 'dd/MM/yyyy');
                return <span>{formattedDate}</span>;
              },
            },
            { 
              Header: 'Statut', 
              accessor: 'status',
              Cell: ({value}) => {
                return <span>{value === true ? 'Actif' : 'Inactif'}</span>
              }
            },
          ];
      }, [organization.contests]);  
    
      const data = React.useMemo(() => organization.organization.contests || [], organization.organization.contests);
    
      const sortTypes = {
        datetime: (rowA, rowB, columnId) => {
          const valueA = new Date(rowA.values[columnId]);
          const valueB = new Date(rowB.values[columnId]);
          return valueA.getTime() - valueB.getTime();
        },
      };
    
      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state: { pageIndex, pageSize },
      } = useTable(
        {
          columns,
          data,
          sortTypes,
          initialState: {
            disableSortRemove: true,
            sortBy: [
              {
                id: 'contest.creationDate',
                desc: true,
              },
            ],
          },
        },
        useSortBy,
        usePagination
      );

    return (
        <div className='w-full'>
            <p className="font-bold mb-4">{data.length} concours</p>
            <table {...getTableProps()} className="w-full table-auto">
                <thead className="table-header">
                {headerGroups.map((headerGroup) => (
                    <tr
                    {...headerGroup.getHeaderGroupProps()}
                    className="space-x-1 gap-12 divide-x-2 divide-white border-t-gray-200 border-t-4"
                    >
                    {headerGroup.headers.map((column) => (
                        <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        className="min-w-[120px] max-w-[347px] pl-4 pr-12 py-4 bg-gray-100 font-normal"
                        >
                        {column.render("Header")}
                        {column.isSorted ? (
                            column.isSortedDesc ? (
                            <span className="ml-2">
                                <RiSortDesc />
                            </span>
                            ) : (
                            <span className="ml-2">
                                <RiSortAsc />
                            </span>
                            )
                        ) : (
                            ""
                        )}
                        </th>
                    ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                    prepareRow(row);
                    return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                        return (
                            <td
                            {...cell.getCellProps()}
                            className={`min-w-[120px] max-w-[347px] pl-4 pr-12 py-4 border-b-[1px] border-b-gray-300 mr-1`}
                            >
                            {cell.render("Cell")}
                            </td>
                        );
                        })}
                    </tr>
                    );
                })}
                </tbody>
            </table>
            <button className='bg-gray-100 font-semibold px-14 py-5 rounded-full mt-10 hover:bg-gray-200'>Nouveau concours</button>
        </div>
    );
}

export default ContestTab;
