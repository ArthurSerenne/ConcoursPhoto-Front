import React, { useState, useEffect } from 'react';
import { Field, ErrorMessage } from 'formik';
import myImage from '../../../assets/images/user-icon.png';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import OrganizationTypeEnum from '../../enums/OrganizationTypeEnum';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import axiosInstance from '../../AxiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../AuthContext';

const validationSchema = Yup.object().shape({
  logo: Yup.string().required('Ce champ est requis'),
  name: Yup.string().required('Ce champ est requis'),
  address: Yup.string().required('Ce champ est requis'),
  type: Yup.string(),
  email: Yup.string().email('Email invalide').required('Ce champ est requis'),
  phone: Yup.string().required('Ce champ est requis'),
  website: Yup.string().url('URL invalide'),
  siret: Yup.string(),
  vat: Yup.string(),
  description: Yup.string(),
  city: Yup.object().nullable().required('Ce champ est requis'),
  zipcode: Yup.object().nullable().required('Ce champ est requis'),
  facebook: Yup.string().url('URL invalide'),
  youtube: Yup.string().url('URL invalide'),
  linkedin: Yup.string().url('URL invalide'),
  tiktok: Yup.string().url('URL invalide'),
  instagram: Yup.string().url('URL invalide'),
  twitter: Yup.string().url('URL invalide'),
});

const OrganizationTab = ({ organization }) => {
  const { user, reloadUser } = useAuth();
  const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const imagePath = organization?.logo
    ? `${baseUrl}${organization.logo}`
    : myImage;
  const [displayedImage, setDisplayedImage] = useState(imagePath);
  const [originalImage, setOriginalImage] = useState(imagePath);
  const [imageRemoved, setImageRemoved] = useState(false);

  useEffect(() => {
    setDisplayedImage(imagePath);
    setOriginalImage(imagePath);
  }, [imagePath]);

  const loadZipCode = (inputValue) => {
    return axios
      .get(process.env.REACT_APP_API_URL + '/cities.json', {
        params: {
          zip_code: inputValue,
        },
      })
      .then((res) => {
        return res.data.map((city) => ({
          value: city.id,
          label: city.zip_code,
        }));
      });
  };

  const loadCities = (inputValue) => {
    return axios
      .get(process.env.REACT_APP_API_URL + '/cities.json', {
        params: {
          name: inputValue,
        },
      })
      .then((res) => {
        return res.data.map((city) => ({
          value: `${process.env.REACT_APP_API_URL}/cities/${city.id}`,
          label: city.name,
        }));
      });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDisplayedImage(reader.result);
        setImageRemoved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    if (window.confirm('Voulez-vous vraiment supprimer cette image ?')) {
      setDisplayedImage(null);
      setOriginalImage(null);
      setImageRemoved(true);
    }
  };

  const separateEntityData = (values) => {
    const entity1Data = {
      name: values.name,
      address: values.address,
      type: values.type,
      email: values.email,
      phone: values.phone,
      logo: values.logo,
      website: values.website,
      description: values.description,
      siret: values.siret,
      vat: values.vat,
      city: values.city ? values.city.value : null,
    };

    const entity2Data = {
      facebook: values.facebook,
      youtube: values.youtube,
      instagram: values.instagram,
      twitter: values.twitter,
      linkedin: values.linkedin,
      tiktok: values.tiktok,
    };

    return { entity1Data, entity2Data };
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    const updateProcess = async () => {
      const { entity1Data, entity2Data } = separateEntityData(values);

      if (imageRemoved) {
        entity1Data.logo = null;
      } else if (originalImage !== displayedImage) {
        entity1Data.logo = displayedImage;
      } else {
        entity1Data.logo = user.member.logo;
      }

      const data = {
        entity1Data,
        entity2Data,
      };

      let response = '';
      if (organization.id) {
        response = await axiosInstance.patch(
          `${process.env.REACT_APP_API_URL}/organization_update/${organization.id}`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        response = await axiosInstance.post(
          `${process.env.REACT_APP_API_URL}/organization_new`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      if (response.status === 200) {
        console.log('Formulaire soumis avec succès');
        setImageRemoved(false);
        await reloadUser();
      }
    };

    toast
      .promise(updateProcess(), {
        pending: "Mise à jour des informations de l'organisation...",
        success: "Informations de l'organisation mises à jour avec succès !",
        error:
          "Erreur lors de la mise à jour des informations de l'organisation. Veuillez réessayer.",
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      initialValues={{
        logo: organization?.logo ?? myImage,
        name: organization?.name ?? '',
        address: organization?.address ?? '',
        type: organization?.type ?? '',
        description: organization?.description ?? '',
        email: organization?.email ?? '',
        phone: organization?.phone ?? '',
        website: organization?.website ?? '',
        siret: organization?.siret ?? '',
        vat: organization?.vat ?? '',
        city: organization?.city
          ? {
              value: `${process.env.REACT_APP_API_URL}/cities/${organization?.city.id}`,
              label: organization?.city.name,
            }
          : '',
        zipcode: organization?.city
          ? { value: organization?.city, label: organization?.city.zip_code }
          : null,
        facebook: organization?.socialNetwork?.facebook ?? '',
        youtube: organization?.socialNetwork?.youtube ?? '',
        linkedin: organization?.socialNetwork?.linkedin ?? '',
        tiktok: organization?.socialNetwork?.tiktok ?? '',
        instagram: organization?.socialNetwork?.instagram ?? '',
        twitter: organization?.socialNetwork?.twitter ?? '',
      }}
    >
      <Form>
        <div>
          <div className="flex flex-col items-center gap-6 lg:flex-row">
            <img
              src={displayedImage || myImage}
              className={`h-[112px] w-[112px] rounded-full object-cover`}
            />
            <div className="relative">
              <label
                htmlFor="file-upload"
                className="w-[200px] cursor-pointer rounded-full bg-gray-300 px-8 py-5 font-bold hover:bg-gray-200"
              >
                Télécharger ma photo
              </label>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                name="logo"
                onChange={handleImageChange}
              />
            </div>
            <div>
              <button
                type="button"
                className="h-14 w-fit rounded-full bg-gray-200 px-8 py-2 font-bold text-black hover:bg-gray-100"
                onClick={handleImageRemove}
              >
                Supprimer
              </button>
            </div>
          </div>
          <div className="mt-8">
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
              <div>
                <label>
                  <p>Nom de l’organisation*</p>
                  <Field
                    type="text"
                    name="name"
                    className="mb-4 mt-1 h-[43px] w-[432px] rounded-md bg-gray-100 px-4 py-2"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500"
                  />
                </label>
                <label>
                  <p>Type d’organisation</p>
                  <Field
                    as="select"
                    name="type"
                    className="mb-4 mt-1 h-[43px] w-[432px] rounded-md bg-gray-100 px-4 py-2"
                  >
                    {Object.entries(OrganizationTypeEnum).map(
                      ([key, value]) => (
                        <option value={key} key={key}>
                          {value}
                        </option>
                      )
                    )}
                  </Field>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-red-500"
                  />
                </label>
                <label>
                  <p>Email*</p>
                  <Field
                    type="email"
                    name="email"
                    className="mb-4 mt-1 h-[43px] w-[432px] rounded-md bg-gray-100 px-4 py-2"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500"
                  />
                </label>
                <label>
                  <p>Téléphone*</p>
                  <Field
                    type="text"
                    name="phone"
                    className="mb-4 mt-1 h-[43px] w-[432px] rounded-md bg-gray-100 px-4 py-2"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500"
                  />
                </label>
                <label>
                  <p>Site web de l’organisation</p>
                  <Field
                    type="text"
                    name="website"
                    className="mb-4 mt-1 h-[43px] w-[432px] rounded-md bg-gray-100 px-4 py-2"
                  />
                  <ErrorMessage
                    name="website"
                    component="div"
                    className="text-red-500"
                  />
                </label>
              </div>
              <div>
                <label>
                  <p>Adresse*</p>
                  <Field
                    type="text"
                    name="address"
                    className="mb-4 mt-1 h-[43px] w-[432px] rounded-md bg-gray-100 px-4 py-2"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500"
                  />
                </label>
                <div className="grid max-w-[432px] grid-cols-2 gap-4">
                  <label>
                    <p>Code postal*</p>
                    <Field name="zipcode">
                      {({ field, form }) => (
                        <AsyncSelect
                          {...field}
                          className="gray-select mb-4 mt-1 h-[43px] w-[210px] rounded-md bg-gray-100 p-1"
                          loadOptions={loadZipCode}
                          onChange={(option) =>
                            form.setFieldValue(field.name, option)
                          }
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="zipcode"
                      component="div"
                      className="text-red-500"
                    />
                  </label>
                  <label>
                    <p>Ville*</p>
                    <Field name="city">
                      {({ field, form }) => (
                        <AsyncSelect
                          {...field}
                          className="gray-select mb-4 mt-1 h-[43px] w-[210px] rounded-md bg-gray-100 p-1"
                          loadOptions={loadCities}
                          onChange={(option) =>
                            form.setFieldValue(field.name, option)
                          }
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="text-red-500"
                    />
                  </label>
                </div>
                <div className="grid max-w-[432px] grid-cols-2 gap-4">
                  <label>
                    <p>Pays*</p>
                    <Field
                      name="country"
                      as="select"
                      className="mb-4 mt-1 h-[43px] w-[210px] rounded-md bg-gray-100 px-4 py-2"
                    >
                      <option value="FR">France</option>
                    </Field>
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="text-red-500"
                    />
                  </label>
                </div>
                <label>
                  <p>N° de Siret</p>
                  <Field
                    type="text"
                    name="siret"
                    className="mb-4 mt-1 h-[43px] w-[432px] rounded-md bg-gray-100 px-4 py-2"
                  />
                  <ErrorMessage
                    name="siret"
                    component="div"
                    className="text-red-500"
                  />
                </label>
                <label>
                  <p>TVA intracommunautaire</p>
                  <Field
                    type="text"
                    name="vat"
                    className="mb-4 mt-1 h-[43px] w-[432px] rounded-md bg-gray-100 px-4 py-2"
                  />
                  <ErrorMessage
                    name="vat"
                    component="div"
                    className="text-red-500"
                  />
                </label>
              </div>
            </div>
            <div className="mt-10">
              <p className="mb-4 font-bold">Présentation</p>
              <p className="w-96 text-sm lg:w-full">
                Fiche de présentation associée aux concours publiés par
                l’organisation
              </p>
              <Field
                as="textarea"
                name="description"
                className="mb-4 mt-3 h-[242px] w-full rounded-md bg-gray-100 px-4 pt-4 text-sm lg:w-[929px]"
                placeholder="Présentez brièvement votre organisation..."
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mt-10">
              <p className="mb-4 font-bold">
                Réseaux sociaux de l’organisation
              </p>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <label>
                  <p>Votre page Facebook</p>
                  <Field
                    type="text"
                    name="facebook"
                    className="mb-4 mt-1 h-[43px] w-[432px] rounded-md bg-gray-100 px-4 py-2"
                  />
                  <ErrorMessage
                    name="facebook"
                    component="div"
                    className="text-red-500"
                  />
                </label>
                <label>
                  <p>Votre chaîne Youtube</p>
                  <Field
                    type="text"
                    name="youtube"
                    className="mb-4 mt-1 h-[43px] w-[432px] rounded-md bg-gray-100 px-4 py-2"
                  />
                  <ErrorMessage
                    name="youtube"
                    component="div"
                    className="text-red-500"
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <label>
                  <p>Votre page Instagram</p>
                  <Field
                    type="text"
                    name="instagram"
                    className="mb-4 mt-1 h-[43px] w-[432px] rounded-md bg-gray-100 px-4 py-2"
                  />
                  <ErrorMessage
                    name="instagram"
                    component="div"
                    className="text-red-500"
                  />
                </label>
                <label>
                  <p>Votre compte Twitter</p>
                  <Field
                    type="text"
                    name="twitter"
                    className="mb-4 mt-1 h-[43px] w-[432px] rounded-md bg-gray-100 px-4 py-2"
                  />
                  <ErrorMessage
                    name="twitter"
                    component="div"
                    className="text-red-500"
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <label>
                  <p>Votre page Linkedin</p>
                  <Field
                    type="text"
                    name="linkedin"
                    className="mb-4 mt-1 h-[43px] w-[432px] rounded-md bg-gray-100 px-4 py-2"
                  />
                  <ErrorMessage
                    name="linkedin"
                    component="div"
                    className="text-red-500"
                  />
                </label>
                <label>
                  <p>Votre compte TikTok</p>
                  <Field
                    type="text"
                    name="tiktok"
                    className="mb-4 mt-1 h-[43px] w-[432px] rounded-md bg-gray-100 px-4 py-2"
                  />
                  <ErrorMessage
                    name="tiktok"
                    component="div"
                    className="text-red-500"
                  />
                </label>
              </div>
            </div>
            <button
              className="mt-10 rounded-full bg-black px-14 py-5 font-semibold text-white hover:bg-gray-500"
              type="submit"
            >
              Sauvergarder
            </button>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default OrganizationTab;
