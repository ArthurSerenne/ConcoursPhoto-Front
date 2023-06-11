import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import myImage from '../../assets/images/user-icon.png';
import axiosInstance from '../AxiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import OrganizationTab from './organization/OrganizationTab';
import AdminTab from './organization/AdminTab';
import ContestTab from './organization/ContestTab';
import AdTab from './organization/AdTab';

const validationSchema = Yup.object().shape({
    logo: Yup.string()
        .required('Ce champ est requis'),
    name: Yup.string()
        .required('Ce champ est requis'),
    address: Yup.string()
        .required('Ce champ est requis'),
    type: Yup.string(),
    email: Yup.string()
        .email('Email invalide')
        .required('Ce champ est requis'),
    phone: Yup.string()
        .required('Ce champ est requis'),
    website: Yup.string()
        .url('URL invalide'),
    siret: Yup.string(),
    vat: Yup.string(),
    description: Yup.string(),
    city: Yup.object()
        .nullable()
        .required('Ce champ est requis'),
    zipcode: Yup.object()
        .nullable()
        .required('Ce champ est requis'),
    facebook: Yup.string()
        .url('URL invalide'),
    youtube: Yup.string()
        .url('URL invalide'),
    linkedin: Yup.string()
        .url('URL invalide'),
    tiktok: Yup.string()
        .url('URL invalide'),
    instagram: Yup.string()
        .url('URL invalide'),
    twitter: Yup.string()
        .url('URL invalide'),
});

const MyOrganizationTab = ({ organization, deselectOrganization }) => {
    const { user, reloadUser } = useAuth();
    const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
    const imagePath = organization?.logo ? `${baseUrl}${organization.logo}` : myImage;
    const [displayedImage, setDisplayedImage] = useState(imagePath);
    const [originalImage, setOriginalImage] = useState(imagePath);
    const [imageRemoved, setImageRemoved] = useState(false);

    useEffect(() => {
        setDisplayedImage(imagePath);
        setOriginalImage(imagePath);
    }, [imagePath]);

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

          const response = await axiosInstance.patch(
            `${process.env.REACT_APP_API_URL}/organization_update/${organization.id}`,
            data,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );          

          if (response.status === 200) {
              console.log("Formulaire soumis avec succès");
              setImageRemoved(false);
              await reloadUser();
          }
        };

        toast.promise(
          updateProcess(),
          {
            pending: 'Mise à jour des informations de l\'organisation...',
            success: 'Informations de l\'organisation mises à jour avec succès !',
            error: 'Erreur lors de la mise à jour des informations de l\'organisation. Veuillez réessayer.'
          }
        ).finally(() => setSubmitting(false));
      };

      const goBack = () => {
        deselectOrganization();
      };

    return (
        <Formik
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            initialValues={{
                logo: organization?.logo ?? myImage,
                name: organization?.name ?? "",
                address: organization?.address ?? "",
                type: organization?.type ?? "",
                description: organization?.description ?? "",
                email: organization?.email ?? "",
                phone: organization?.phone ?? "",
                website: organization?.website ?? "",
                siret: organization?.siret ?? "",
                vat: organization?.vat ?? "",
                city: organization?.city ? { value: `${process.env.REACT_APP_API_URL}/cities/${organization?.city.id}`, label: organization?.city.name } : "",
                zipcode: organization?.city ? { value: organization?.city, label: organization?.city.zip_code } : null,
                facebook: organization?.socialNetwork?.facebook ?? "",
                youtube: organization?.socialNetwork?.youtube ?? "",
                linkedin: organization?.socialNetwork?.linkedin ?? "",
                tiktok: organization?.socialNetwork?.tiktok ?? "",
                instagram: organization?.socialNetwork?.instagram ?? "",
                twitter: organization?.socialNetwork?.twitter ?? "",
            }}
        >
        <Form>
            <Tabs>
                <div className="grid gris-cols-1 md:grid-cols-5 sm:max-w-screen-sm 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md">
                    <div className='md:col-span-1'>
                        <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                            <AiOutlineArrowLeft className='mr-2' /> Retour
                        </Link>
                        <TabList className={'mt-6 flex flex-col space-y-2 w-full'}>
                            <Tab className={'tab-left w-full'}>Identité & coordonnées</Tab>
                            <Tab className={'tab-left w-full'}>Administrateurs</Tab>
                            <Tab className={'tab-left w-full'}>Concours</Tab>
                            <Tab className={'tab-left w-full'}>Publicités</Tab>
                        </TabList>
                    </div>
                    <div className='md:col-span-4 w-full'>
                        <p className="text-3xl font-bold not-italic leading-[160%] text-black leading-tight mb-6">{organization.name}</p>
                        <TabPanel>
                            <OrganizationTab organization={organization} />
                        </TabPanel>
                        <TabPanel>
                            <AdminTab organization={organization} />
                        </TabPanel>
                        <TabPanel>
                            <ContestTab organization={organization} />
                        </TabPanel>
                        <TabPanel>
                            <AdTab organization={organization} />
                        </TabPanel>
                    </div>
                </div>
                </Tabs>
            </Form>
        </Formik>
    );
};

export default MyOrganizationTab;