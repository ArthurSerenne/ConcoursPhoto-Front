import React, { useState } from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import { useAuth } from '../AuthContext';
import { RiSortAsc, RiSortDesc } from "react-icons/ri";
import OrganizationTypeEnum from '../enums/OrganizationTypeEnum';

const OrganizationsTab = ({ setSelectedOrganization, setIsNew }) => {
    const { isAuthenticated, user } = useAuth();
    const [organization, setOrganization] = useState(null);
    const [newOrganization, setNewOrganization] = useState(null);

    const handleButtonClick = () => {
      const newOrganization = {};
      setOrganization(newOrganization);
      setSelectedOrganization(newOrganization);
      setNewOrganization(true);
  };  

  const columns = React.useMemo(
    () => [
      { Header: 'Nom de l’organisation', accessor: 'name' },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: ({value}) => OrganizationTypeEnum[value] || value
      },      
      { 
        Header: 'Concours', 
        accessor: 'contests.length',
      },
      { Header: 'Administrateurs', accessor: 'users.length' },
    ],
    []
  );

  const data = React.useMemo(() => isAuthenticated && user.organizations || [], [isAuthenticated, user.organizations]);

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
  } = useTable(
    {
      columns,
      data,
      sortTypes,
      initialState: {
        disableSortRemove: true,
      },
    },
    useSortBy,
    usePagination
  );

  const handleOrganizationClick = (organization) => {
    setSelectedOrganization(organization);
    setNewOrganization(false);
  };

    return (
        <div>
            <p className="font-bold">Ce menu est destiné uniquement aux membres qui souhaitent créer la fiche d’une ou plusieurs organisations qu’ils représentent légalement pour publier un concours.</p>
            <p>La création d’une fiche “organisation” est un préalable indispensable pour créer ensuite un concours photo en son nom.</p>
            <div className='mt-8'>
                <p className="font-bold mb-4">{data.length} organisations dont je suis l’un des administrateurs</p>
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
                        <tr {...row.getRowProps()} className='hover:bg-gray-100 cursor-pointer' onClick={() => handleOrganizationClick(row.original)}>
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
            </div>
            <div>
                <button
                    onClick={handleButtonClick}
                    className='bg-gray-100 font-semibold px-14 py-5 rounded-full mt-10 hover:bg-gray-200'
                >
                    Ajouter une organisation
                </button>
            </div>
        </div>
    );
}

export default OrganizationsTab;
