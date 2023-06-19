import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { useTable, useSortBy, usePagination } from 'react-table';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { RiCloseLine, RiSortAsc, RiSortDesc } from 'react-icons/ri';

const JuryMembersContestTab = ({ user, contest, setContest, goBack }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [emailInput, setEmailInput] = useState('');

  const handleEditClick = () => {
    setModalOpen(true);
  };

  const saveAndUpdate = () => {
    // Envoyer les e-mails à la liste des adresses e-mail (emailList)
    // ...

    toast.promise({
      pending: 'Mise à jour des membres du jury du concours...',
      success: 'Les membres du jury du concours ont bien été mis à jour !',
      error:
        'Une erreur est survenue lors de la mise à jour des membres du jury du concours.',
    });
  };

  const handleCancelClick = () => {
    setModalOpen(false);
  };

  const closeModalWhenClickedOutside = (e) => {
    if (e.target.classList.contains('fixed')) {
      handleCancelClick();
    }
  };

  const handleEmailInputChange = (event) => {
    setEmailInput(event.target.value);
  };

  const handleAddMember = () => {
    if (emailInput) {
      setEmailList([...emailList, emailInput]);
      setEmailInput('');
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Nom',
        accessor: 'member.user.lastname',
        Cell: ({ value }) => <span className="uppercase">{value}</span>,
      },
      { Header: 'Prénom', accessor: 'member.user.firstname' },
      { Header: 'Fonction/poste', accessor: 'fonction' },
      {
        Header: 'Statut',
        accessor: 'status',
        Cell: ({ value }) => {
          let color = '';
          if (value === 'accepté')
            color =
              'gap-2.5 rounded-[14.5px] bg-[#00CE3A] px-[15px] py-[5px] text-center text-[10px] font-semibold uppercase not-italic leading-[160%] text-white';
          if (value === 'refusé')
            color =
              'gap-2.5 rounded-[14.5px] bg-[#ff0000] px-[15px] py-[5px] text-center text-[10px] font-semibold uppercase not-italic leading-[160%] text-white';
          if (value === 'en attente')
            color =
              'gap-2.5 rounded-[14.5px] bg-[#00A3FF] px-[15px] py-[5px] text-center text-[10px] font-semibold uppercase not-italic leading-[160%] text-white';
          return <span className={color}>{value}</span>;
        },
      },
    ],
    []
  );

  const data = React.useMemo(
    () => contest.juryMembers || [],
    [contest.juryMembers]
  );

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          disableSortRemove: true,
        },
      },
      useSortBy,
      usePagination
    );

  return (
    <>
      <div className="flex items-center justify-start space-x-8">
        <h2 className="text-2xl font-normal not-italic">Membres du Jury</h2>
        {user &&
          user.organizations &&
          contest.organization &&
          user.organizations.some(
            (org) => org.id === contest.organization.id
          ) && (
            <button
              className="gap-2.5 rounded-[30px] bg-black px-[15px] py-[5px] text-center text-[8px] font-bold uppercase not-italic leading-[10px] text-white"
              onClick={handleEditClick}
            >
              Éditer
            </button>
          )}
      </div>
      {contest.juryMembers?.map((juryMember) => (
        <div key={juryMember.id} className="mt-2 bg-[#F1F1F1] p-5">
          <p>
            <span className="font-bold">
              {juryMember.member.user.firstname}
            </span>{' '}
            <span className="font-bold uppercase">
              {juryMember.member.user.lastname}
            </span>
            , {juryMember.fonction}
          </p>
        </div>
      ))}
      {user &&
      user.organizations &&
      contest.organization &&
      user.organizations.some((org) => org.id === contest.organization.id) ? (
        <>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCancelClick}
            contentLabel="Edit Jury Members Modal"
            overlayClassName=""
            className=""
            overlayRef={(overlay) => {
              if (overlay) {
                overlay.addEventListener('click', closeModalWhenClickedOutside);
              }
            }}
          >
            <div className="flex justify-between">
              <h1 className="mb-2 text-xl font-bold">
                Concours {'>'} onglet “Membres du jury” : édition
              </h1>
              <button
                onClick={handleCancelClick}
                className="absolute right-2.5 top-2.5"
              >
                <RiCloseLine />
              </button>
            </div>
            <p className="flex items-center text-sm font-bold not-italic leading-[17px] text-black">
              Vous pouvez inviter un ou plusieurs membres du jury mais ils
              doivent être inscrits/membres de la plateforme au préalable.
            </p>
            <p className="flex items-center text-sm font-normal not-italic leading-[17px] text-black">
              Chaque membre invité recevra un email de demande qu’il devra
              valider pour intégrer la liste des membres du jury de ce concours.
            </p>
            <br />
            <table {...getTableProps()} className="w-full table-auto">
              <thead className="table-header">
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    className="gap-12 space-x-1 divide-x-2 divide-white border-t-4 border-t-gray-200"
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
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
                    <tr {...row.getRowProps()} className="hover:cursor-pointer">
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
            <br />
            <p className="flex items-center text-sm font-bold not-italic leading-[17px] text-black">
              Pour inviter un membre du jury, veuillez renseigner son email
              ci-dessous*
            </p>
            <p className="flex items-center text-sm font-normal not-italic leading-[17px] text-black">
              Vous devez saisir l’email utilisé par le membre ou saisir son
              nom/prénom si vous ne le connaissez pas.
            </p>
            <input
              type="email"
              value={emailInput}
              className="rounded-[5px] bg-[#F1F1F1]"
              onChange={handleEmailInputChange}
            />
            <button
              className="ml-10 gap-5 rounded-[44px] bg-[#d9d9d9] px-[30px] py-3.5 text-center text-sm font-bold not-italic leading-[17px] text-[#333333]"
              onClick={handleAddMember}
            >
              Ajouter un membre du jury
            </button>
            {emailList.map((email, index) => (
              <p key={index}>{email}</p>
            ))}
            <br />
            <div className="mt-4">
              <button
                className="mr-4 gap-5 rounded-[44px] bg-regal-grey px-12 py-3.5 text-base font-bold not-italic leading-[19px] text-white"
                onClick={handleCancelClick}
              >
                Annuler
              </button>
              <button
                className="gap-5 rounded-[44px] bg-black px-12 py-3.5 text-base font-bold not-italic leading-[19px] text-white"
                onClick={saveAndUpdate}
              >
                Sauvegarder
              </button>
            </div>
          </Modal>
        </>
      ) : (
        <></>
      )}
      <div className="mx-auto mt-10 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <Link
          onClick={goBack}
          className="mr-4 flex w-fit items-center rounded-[44px] bg-button-grey px-[25px] py-3.5"
        >
          <AiOutlineArrowLeft className="mr-2" /> Retour
        </Link>
      </div>
    </>
  );
};

export default JuryMembersContestTab;
