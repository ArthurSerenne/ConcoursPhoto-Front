import { useTable, useSortBy, usePagination } from 'react-table';
import { format, parseISO } from 'date-fns';
import ContestDateStatus from '../../ContestDateStatus';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { RiCloseLine, RiSortAsc, RiSortDesc } from 'react-icons/ri';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axiosInstance from '../../AxiosInstance';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useAuth } from '../../AuthContext';

const validationSchema = Yup.object().shape({
  prices: Yup.string().required('Ce champ est requis'),
  sponsors: Yup.string().required('Ce champ est requis'),
  total: Yup.string().required('Ce champ est requis'),
  theme: Yup.string().required('Ce champ est requis'),
});

const ContestTab = ({ organization }) => {
  const { reloadUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowData, setRowData] = useState(null);

  const zoneMapping = {
    departement: 'Département',
    regional: 'Régional',
  };

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
        Cell: ({ row }) => {
          return <ContestDateStatus contest={row.original} />;
        },
      },
    ];
  }, [organization.contests]);

  const data = React.useMemo(
    () => organization.contests || [],
    organization.contests
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

  const navigate = useNavigate();

  const openModal = (data) => {
    if (data) {
      setRowData(data);
    } else {
      setRowData({});
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRowData(null);
  };

  const handleCancelClick = () => {
    setIsModalOpen(false);
  };

  const closeModalWhenClickedOutside = (e) => {
    if (e.target.classList.contains('fixed')) {
      handleCancelClick();
    }
  };

  const handleRowClick = async (contest) => {
    const viewCount = contest.view ? contest.view + 1 : 1;

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

      navigate(`/concours-photo/${contest.id}`, {
        state: { contest: { ...contest, view: viewCount } },
      });
    } catch (error) {
      console.error('Failed to update view count: ', error);
    }
  };

  const separateEntityData = (values) => {
    const entity1Data = {
      zone: zoneMapping[values.zone],
      prices: values.prices,
      sponsors: values.sponsors,
      total: values.total,
      theme: values.theme,
      organization: organization.name,
    };

    return { entity1Data };
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setSubmitting(true);
    const updateProcess = async () => {
      const { entity1Data } = separateEntityData(values);

      const data = {
        entity1Data,
      };

      console.log(entity1Data);

      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/contest_request`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log('Formulaire soumis avec succès');
        await reloadUser();
      } else {
        console.log(response.status);
      }
    };

    toast
      .promise(updateProcess(), {
        pending: "Demande de création d'un concours en cours",
        success: "Demande de création d'un concours  envoyé avec succès !",
        error: (err) => {
          if (err.message === 'EmailChanged') {
            return 'Veuillez vous reconnecter avec votre nouvelle adresse e-mail.';
          } else {
            return 'Erreur lors de la mise à jour du profil. Veuillez réessayer.';
          }
        },
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="w-full">
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
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Ligne sélectionnée"
          overlayClassName="fixed inset-0"
          className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-80 p-4"
          overlayRef={(overlay) => {
            if (overlay) {
              overlay.addEventListener('click', closeModalWhenClickedOutside);
            }
          }}
        >
          <div className="relative max-h-[863px] max-w-[530px] space-y-2 overflow-auto rounded-lg bg-white px-10 py-7">
            <button className="absolute right-2 top-1" onClick={closeModal}>
              <RiCloseLine className="scale-150" />
            </button>
            <p className="text-xl font-bold">Nouveau concours</p>
            <p className="text-sm">
              Ce formulaire vous permet de soumettre une demande de création
              d’un nouveau concours photo. Un devis vous sera envoyé par email
              qui tiendra compte de la nature de votre organisation et du
              concours que vous souhaitez publier.
            </p>
            <div className="grid grid-cols-1">
              <Formik
                initialValues={{
                  zone: '',
                  prices: '',
                  sponsors: '',
                  total: '',
                  theme: '',
                }}
                onSubmit={handleSubmit}
                validateOnBlur={true}
                validateOnChange={true}
                validationSchema={validationSchema}
              >
                {({ isSubmitting }) => (
                  <Form className="my-2 grid grid-cols-1">
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="zone" className="text-sm">
                          Quelle est l’étendue/zone de visibilité du concours ?
                        </label>
                        <Field
                          as="select"
                          name="zone"
                          className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 pl-3"
                        >
                          <option value="departement">Département</option>
                          <option value="regional">Régional</option>
                        </Field>
                      </div>
                      <div>
                        <label htmlFor="prices" className="text-sm">
                          Combien y-a-t-il de prix à gagner ?*
                        </label>
                        <Field
                          name="prices"
                          type="text"
                          className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 pl-3"
                        />
                        <ErrorMessage
                          name="prices"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="sponsors" className="text-sm">
                          Combien y-a-t-il de sponsors ?*
                        </label>
                        <Field
                          name="sponsors"
                          type="text"
                          className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 pl-3"
                        />
                        <ErrorMessage
                          name="sponsors"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="total" className="text-sm">
                          Quelle est la valeur totale des dotations/prix à
                          gagner ?*
                        </label>
                        <Field
                          name="total"
                          type="text"
                          className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 pl-3"
                        />
                        <ErrorMessage
                          name="total"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="theme" className="text-sm">
                          Quel est le thème et la nature du concours ?*
                        </label>
                        <Field
                          as="textarea"
                          name="theme"
                          className="mb-4 mt-3 h-[241px] w-[432px] w-full rounded-md bg-gray-100 px-4 pt-4 text-sm"
                          placeholder="Présentez brièvement l’objet et la finalité du concours, sa portée, les sponsors, les lots mis en jeu..."
                        />
                        <ErrorMessage
                          name="theme"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="flex flex-row items-baseline">
                        <Field
                          className="mr-3 scale-150"
                          type="checkbox"
                          name="check"
                        />
                        <label htmlFor="check" className="text-xs">
                          Je déclare exercer un mandat ou une fonction qui
                          m’octroie le droit de publier des jeux concours au nom
                          de l’organisation que je représente
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <button
                        className="mt-10 w-[245px] rounded-full bg-black px-14 py-5 font-semibold text-white hover:bg-gray-500"
                        type="submit"
                      >
                        Valider
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Modal>
      </table>
      <button
        className="mt-10 rounded-full bg-gray-100 px-14 py-5 font-semibold hover:bg-gray-200"
        onClick={() => openModal()}
      >
        Nouveau concours
      </button>
    </div>
  );
};

export default ContestTab;
