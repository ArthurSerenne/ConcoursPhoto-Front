import React from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import { format, parseISO } from "date-fns";
import { RiSortAsc, RiSortDesc } from "react-icons/ri";
import AdSpaceDateStatus from '../../AdSpaceDateStatus';

const AdTab = ({organization, adSpacesData}) => {
  const columns = React.useMemo(() => {
    return [
        { Header: 'Nom de l’emplacement de la publicité', accessor: 'adSpace.name' },
        {
            Header: 'Début',
            accessor: 'start_date',
            Cell: ({ value }) => {
                const formattedDate = format(parseISO(value), 'dd/MM/yyyy');
                return <span>{formattedDate}</span>;
            },
        },
        {
            Header: 'Fin',
            accessor: 'end_date',
            Cell: ({ value }) => {
                const formattedDate = format(parseISO(value), 'dd/MM/yyyy');
                return <span>{formattedDate}</span>;
            },
        },
        { 
            Header: 'Statut', 
            Cell: ({row}) => {
                return <AdSpaceDateStatus adSpacesData={row.original} />
            }
        },
        { Header: 'Affichages', accessor: 'test' },
        { Header: 'Clics', accessor: 'click_count' },
    ];
}, [organization.contests]);
    
      const data = React.useMemo(() => adSpacesData || [], adSpacesData);
    
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
            <p className="font-bold mb-4">{data.length} publicités</p>
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
            <button className='bg-gray-100 font-semibold px-14 py-5 rounded-full mt-10 hover:bg-gray-200'>Nouvelle publicité</button>
        </div>
    );
}

export default AdTab;
