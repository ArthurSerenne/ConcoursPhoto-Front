import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useTable, useSortBy, usePagination } from 'react-table';
import { format, parseISO } from 'date-fns';
import {
  RiCloseLine,
  RiSortAsc,
  RiSortDesc,
  RiUpload2Line,
} from 'react-icons/ri';
import AdSpaceDateStatus from '../../AdSpaceDateStatus';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import Select from 'react-select';
import myImage from '../../../assets/images/user-icon.png';
import axiosInstance from '../../AxiosInstance';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useAuth } from '../../AuthContext';

const validationSchema = Yup.object().shape({
  click_url: Yup.string().required('Ce champ est requis'),
  start: Yup.date().required('Ce champ est requis'),
  end: Yup.date().required('Ce champ est requis'),
});

const AdTab = ({ organization, adSpacesData, refreshAdSpacesData }) => {
  const { reloadUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [adSpaces, setAdSpaces] = useState([]);
  const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const [displayImage, setDisplayImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + '/ad_spaces.json'
      );
      setAdSpaces(response.data);
    };
    fetchData();
  }, []);

  const columns = React.useMemo(() => {
    return [
      {
        Header: 'Nom de l’emplacement de la publicité',
        accessor: 'adSpace.name',
      },
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
        Cell: ({ row }) => {
          return <AdSpaceDateStatus adSpacesData={row.original} />;
        },
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

  const openModal = (data) => {
    if (data) {
      setRowData(data);
      setDisplayImage(data.file ? `${baseUrl}${data.file}` : myImage);
      setOriginalImage(data.file ? `${baseUrl}${data.file}` : myImage);
    } else {
      setRowData({});
      setDisplayImage(myImage);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRowData(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDisplayImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelClick = () => {
    setIsModalOpen(false);
    refreshAdSpacesData();
  };

  const closeModalWhenClickedOutside = (e) => {
    if (e.target.classList.contains('fixed')) {
      handleCancelClick();
    }
  };

  const initialValues = {
    name:
      rowData && rowData.id
        ? { value: rowData.adSpace?.id, label: rowData.adSpace?.name }
        : { value: adSpaces[0]?.id, label: adSpaces[0]?.name },
    start:
      rowData && rowData.id && rowData.start_date
        ? format(
            typeof rowData.start_date === 'string'
              ? parseISO(rowData.start_date)
              : rowData.start_date,
            'yyyy-MM-dd'
          )
        : format(new Date(), 'yyyy-MM-dd'),
    end:
      rowData && rowData.id && rowData.end_date
        ? format(
            typeof rowData.end_date === 'string'
              ? parseISO(rowData.end_date)
              : rowData.end_date,
            'yyyy-MM-dd'
          )
        : format(new Date(), 'yyyy-MM-dd'),
    click_url: rowData && rowData.id ? rowData.click_url : '',
    file: rowData && rowData.id ? displayImage : '',
    isDefault: rowData && rowData.id ? false : true,
  };

  const defaultData = {
    click_url: '',
    isDefault: true,
  };

  const separateEntityData = (values) => {
    const entity1Data = {
      name: values.name,
      start: values.start,
      end: values.end,
      click_url: values.click_url,
      isDefault: values.isDefault,
    };

    return { entity1Data };
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setSubmitting(true);
    const updateProcess = async () => {
      const { entity1Data } = separateEntityData(values);

      if (values.isDefault) {
        entity1Data.suggest = values.suggest;
        entity1Data.organization = organization.name;
      }

      if (originalImage !== displayImage) {
        entity1Data.file = displayImage;
      }

      const data = {
        entity1Data,
      };

      console.log(entity1Data);

      let response = '';

      if (values.isDefault) {
        response = await axiosInstance.post(
          `${process.env.REACT_APP_API_URL}/rent_request`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        response = await axiosInstance.patch(
          `${process.env.REACT_APP_API_URL}/rent_update/${rowData.id}`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        console.log('Formulaire soumis avec succès');
        await reloadUser();
      } else {
        console.log(response.status);
      }
    };

    if (values.isDefault) {
      toast
        .promise(updateProcess(), {
          pending: 'Demande de location en cours',
          success: 'Demande de Location envoyé avec succès !',
          error: (err) => {
            if (err.message === 'EmailChanged') {
              return 'Veuillez vous reconnecter avec votre nouvelle adresse e-mail.';
            } else {
              return 'Erreur lors de la mise à jour du profil. Veuillez réessayer.';
            }
          },
        })
        .finally(() => setSubmitting(false));
    } else {
      toast
        .promise(updateProcess(), {
          pending: 'Mise à jour de la location',
          success: 'Location mis à jour avec succès !',
          error: (err) => {
            if (err.message === 'EmailChanged') {
              return 'Veuillez vous reconnecter avec votre nouvelle adresse e-mail.';
            } else {
              return 'Erreur lors de la mise à jour du profil. Veuillez réessayer.';
            }
          },
        })
        .finally(() => setSubmitting(false));
    }
  };

  return (
    <div className="w-full">
      <p className="mb-4 font-bold">{data.length} publicités</p>
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
                onClick={() => openModal(row.original)}
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
          {rowData && (
            <div className="relative max-h-[863px] max-w-[530px] space-y-2 overflow-auto rounded-lg bg-white px-10 py-7">
              <button className="absolute right-2 top-1" onClick={closeModal}>
                <RiCloseLine className="scale-150" />
              </button>
              <p className="text-xl font-bold">
                {rowData.id ? rowData.adSpace.name : 'Nouvelle publicité'}
              </p>
              <p className="text-sm">
                Ce formulaire vous permet de soumettre une demande de création
                d’une nouvelle publicité. Un devis vous sera envoyé par email
                qui tiendra compte de l’emplacement et de la durée.
              </p>
              <div className="grid grid-cols-1">
                <Formik
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                  validateOnBlur={true}
                  validateOnChange={true}
                  validationSchema={validationSchema}
                >
                  {({ isSubmitting }) => (
                    <Form className="my-2 grid grid-cols-1">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="text-sm">
                            Quel emplacement souhaitez-vous louer ?
                          </label>
                          <Field name="name">
                            {({ field, form: { setFieldValue }, meta }) => (
                              <Select
                                {...field}
                                className="gray-select w-full bg-gray-100 p-2"
                                options={adSpaces.map((adSpace) => ({
                                  value: adSpace.id,
                                  label: adSpace.name,
                                }))}
                                onChange={(option) => {
                                  setFieldValue(field.name, option);
                                }}
                                onBlur={field.onBlur}
                              />
                            )}
                          </Field>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div>
                            <label htmlFor="start" className="text-sm">
                              Début d’affichage*
                            </label>
                            <Field
                              name="start"
                              type="date"
                              className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 pl-3"
                            />
                            <ErrorMessage
                              name="start"
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="end" className="text-sm">
                              Fin d’affichage*
                            </label>
                            <Field
                              name="end"
                              type="date"
                              className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 pl-3"
                            />
                            <ErrorMessage
                              name="end"
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm">
                            Téléchargez votre visuel (JPG : 860x300 pixels,{' '}
                            {'<'} 500 Ko)
                          </p>
                          <div className="flex items-center gap-6 md:flex-row">
                            <img
                              src={displayImage}
                              className={`h-[112px] w-[112px] rounded-full object-cover`}
                            />
                            <div className="relative">
                              <label
                                htmlFor="file-upload"
                                className="h-[45px] w-[169px] cursor-pointer rounded-full bg-gray-300 px-7 py-4 font-semibold hover:bg-gray-200"
                              >
                                Télécharger{' '}
                                <RiUpload2Line className="ml-4 scale-150" />
                              </label>
                              <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                name="file"
                                onChange={handleImageChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="click_url" className="text-sm">
                            URL de renvoi au clic*
                          </label>
                          <Field
                            name="click_url"
                            type="text"
                            className="gray-select mt-1 h-[43px] w-full rounded-md bg-gray-100 pl-3"
                          />
                          <ErrorMessage
                            name="click_url"
                            component="div"
                            className="text-red-500"
                          />
                        </div>
                        {!rowData.id ? (
                          <>
                            <div>
                              <label htmlFor="suggest" className="text-sm">
                                Remarques
                              </label>
                              <Field
                                as="textarea"
                                name="suggest"
                                className="mb-4 mt-3 h-[111px] w-[432px] w-full rounded-md bg-gray-100 px-4 pt-4 text-sm"
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
                                m’octroie le droit de publier des publicités au
                                nom de l’organisation que je représente
                              </label>
                            </div>
                          </>
                        ) : (
                          ''
                        )}
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
          )}
        </Modal>
      </table>
      <button
        className="mt-10 rounded-full bg-gray-100 px-14 py-5 font-semibold hover:bg-gray-200"
        onClick={() => openModal(defaultData)}
      >
        Nouvelle publicité
      </button>
    </div>
  );
};

export default AdTab;
