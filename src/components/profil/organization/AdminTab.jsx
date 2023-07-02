import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { RiSortAsc, RiSortDesc } from 'react-icons/ri';

const AdminTab = ({ organization, adminData }) => {
  const columns = React.useMemo(() => {
    return [
      { Header: 'Nom', accessor: 'firstname' },
      { Header: 'Prénom', accessor: 'lastname' },
      {
        Header: 'Fonction/poste',
        accessor: 'status',
        Cell: ({ value }) => {
          return <span>{value === true ? 'Actif' : 'Inactif'}</span>;
        },
      },
    ];
  }, [organization.contests]);

  const data = React.useMemo(() => adminData, [adminData]);

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
    <div className="w-full">
      <p className="mb-4 font-bold">{data.length} administrateurs</p>
      <table {...getTableProps()} className="w-full table-auto">
        <thead className="table-header">
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="gap-12 space-x-1 divide-x-2 divide-white border-t-4 border-t-gray-200"
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="min-w-[120px] max-w-[347px] bg-gray-100 py-4 pl-4 pr-12 font-normal"
                >
                  {column.render('Header')}
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
                    ''
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
                      className={`mr-1 min-w-[120px] max-w-[347px] border-b-[1px] border-b-gray-300 py-4 pl-4 pr-12`}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="mt-10 rounded-full bg-gray-100 px-14 py-5 font-semibold hover:bg-gray-200">
        Ajouter un administrateur
      </button>
    </div>
  );
};

export default AdminTab;
