import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { useAuth } from '../AuthContext';
import {
  RiSortAsc,
  RiSortDesc,
  RiArrowRightSLine,
  RiArrowLeftSLine,
} from 'react-icons/ri';
import { RxDoubleArrowLeft, RxDoubleArrowRight } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ContestParticipationTab = () => {
  const { isAuthenticated, user } = useAuth();

  console.log(user.member);

  const columns = React.useMemo(
    () => [
      { Header: 'Nom du concours', accessor: 'contest.name' },
      {
        Header: 'Statut',
        accessor: 'contest.status',
        Cell: ({ value }) => {
          return <span>{value === true ? 'Actif' : 'Inactif'}</span>;
        },
      },
      { Header: 'Mes photos', accessor: 'contest.trend' },
      { Header: 'Résultat', accessor: 'contest.photos.length' },
    ],
    []
  );

  const data = React.useMemo(
    () => (isAuthenticated && user.member.photos) || [],
    [isAuthenticated, user.member.photos]
  );

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

  const handleRowClick = async (photo) => {
    const viewCount = photo.contest.view ? photo.contest.view + 1 : 1;

    console.log(viewCount);

    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/contests/${photo.contest.id}`,
        { view: viewCount },
        {
          headers: {
            'Content-Type': 'application/merge-patch+json',
          },
        }
      );

      navigate(`/concours-photo/${photo.contest.id}`, {
        state: { contest: { ...photo.contest, view: viewCount } },
      });
    } catch (error) {
      console.error('Failed to update view count: ', error);
    }
  };

  return (
    <div>
      <p className="mb-4 font-bold">{data.length} concours</p>
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
              <tr
                {...row.getRowProps()}
                onClick={() => handleRowClick(row.original)}
                className="cursor-pointer hover:bg-gray-100"
              >
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
      <div className="pagination mt-4 flex justify-between gap-6">
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
        <div className="flex gap-4 align-middle">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <RxDoubleArrowLeft className="scale-150" />
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            <RiArrowLeftSLine className="scale-150" />
          </button>
          {Array.from({ length: pageCount }, (_, index) => {
            const but = index + 1;
            return (
              <button
                key={but}
                onClick={() => gotoPage(but - 1)}
                className="rounded-full bg-gray-200 px-4 py-2 hover:bg-gray-100"
              >
                {but}
              </button>
            );
          })}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            <RiArrowRightSLine className="scale-150" />
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <RxDoubleArrowRight className="scale-150" />
          </button>
        </div>
        <div>
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} sur {pageOptions.length}
            </strong>{' '}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContestParticipationTab;
