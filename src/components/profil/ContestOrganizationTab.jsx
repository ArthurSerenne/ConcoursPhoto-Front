import React from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import { useAuth } from '../AuthContext';
import { format, parseISO } from "date-fns";
import { RiSortAsc, RiSortDesc, RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ContestOrganizationTab = () => { 
  const { isAuthenticated, user } = useAuth();

  const columns = React.useMemo(() => {
    if (user && user.organizations && user.organizations[0]) {
      return [
        { Header: 'Nom du concours', accessor: 'name' },
        {
          Header: 'Date de début du concours',
          accessor: 'creationDate',
          Cell: ({ value }) => {
            const formattedDate = format(parseISO(value), 'dd/MM/yyyy');
            return <span>{formattedDate}</span>;
          },
        },
        {
          Header: 'Date de fin du concours',
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
        { Header: 'Participants', accessor: 'trend' },
        { 
          Header: 'Photos', 
          accessor: 'photos',
          Cell: ({value}) => {
            return <span>{value ? value.length : '0'}</span>
          },
        },
      ];
    } else {
      return [
        { Header: 'Nom du concours' },
        { Header: 'Date de début du concours' },
        { Header: 'Date de fin du concours' },
        { Header: 'Statut' },
        { Header: 'Participants' },
        { Header: 'Photos' },
      ];
    }
  }, [user]);

  const data = React.useMemo(() => {
    if (isAuthenticated && user && user.organizations) {
      return user.organizations.flatMap(organization => organization.contests);
    }
    return [];
  }, [isAuthenticated, user]);

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
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageIndex,
    setPageSize,
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
        pageIndex: 0,
        pageSize: 3,
      },
    },
    useSortBy,
    usePagination
  );

  const navigate = useNavigate();

  const handleRowClick = async (contest) => {
    const viewCount = contest.view ? contest.view + 1 : 1;

    console.log(viewCount);

    try {
        await axios.patch(
            `${process.env.REACT_APP_API_URL}/contests/${contest.id}`,
            { view: viewCount },
            {
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                },
            }
        );

        navigate(`/concours-photo/${contest.id}`, { state: { contest: {...contest, view: viewCount } } });
    } catch (error) {
        console.error("Failed to update view count: ", error);
    }
};
  
    return (
      <div>
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
              <tr {...row.getRowProps()} onClick={() => handleRowClick(row.original)} className='hover:bg-gray-100 cursor-pointer'>
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
      <div className="pagination flex justify-between gap-6 mt-4">
        <div>
        Afficher par :
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[3, 6, 9, 12, 15].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className='flex gap-4 align-middle'>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <RxDoubleArrowLeft className='scale-150' />
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            <RiArrowLeftSLine className='scale-150' />
          </button>
          {Array.from({ length: pageCount }, (_, index) => {
            const but = index + 1;
            return (
              <button key={but} onClick={() => gotoPage(but - 1)} className='px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-100 focus:bg-gray-300'>
                {but}
              </button>
            );
          })}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            <RiArrowRightSLine className='scale-150' />
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            <RxDoubleArrowRight className='scale-150' />
          </button>
        </div>
        <div>
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} sur {pageOptions.length}
            </strong>{" "}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ContestOrganizationTab;
