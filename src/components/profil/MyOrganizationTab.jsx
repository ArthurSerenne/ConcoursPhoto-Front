import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Formik, Form, Field } from 'formik';
import myImage from '../../assets/images/user-icon.png';

const MyOrganizationTab = () => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const [imageError, setImageError] = useState(false);

    if (isLoading) {
        return (
          <div>
            <p>Chargement...</p>
          </div>
        );
    }

    if (!isAuthenticated) {
        return (
          <div>
            <p>Veuillez vous connecter pour accéder à cette page.</p>
          </div>
        );
    }

    const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
    const imagePath = user.organizations?.[0]?.logo ? `${baseUrl}${user.organizations[0].logo}` : myImage;

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <Formik
            initialValues={{
                logo: user.organizations?.[0]?.logo ?? myImage,
                name: user.organizations?.[0]?.name ?? "",
                address: user.organizations?.[0]?.address ?? "",
                type: user.organizations?.[0]?.type ?? "",
                email: user.organizations?.[0]?.email ?? "",
                phone: user.organizations?.[0]?.phone ?? "",
                website: user.organizations?.[0]?.website ?? "",
                siret: user.organizations?.[0]?.siret ?? "",
                vat: user.organizations?.[0]?.vat ?? "",
                city: user.organizations?.[0]?.city?.name ?? "",
                zipcode: user.organizations?.[0]?.city?.zip_code ?? "",
                facebook: user.organizations?.[0]?.socialNetwork?.facebook ?? "",
                youtube: user.organizations?.[0]?.socialNetwork?.youtube ?? "",
                linkedin: user.organizations?.[0]?.socialNetwork?.linkedin ?? "",
                tiktok: user.organizations?.[0]?.socialNetwork?.tiktok ?? "",
                instagram: user.organizations?.[0]?.socialNetwork?.instagram ?? "",
                twitter: user.organizations?.[0]?.socialNetwork?.twitter ?? "",
            }}
        >
        <Form>
            <div className="sm:max-w-screen-sm 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md">
                <div className='flex flex-col lg:flex-row gap-6 items-center'>
                    <img src={imageError ? myImage : imagePath}
                        onError={handleImageError}
                        className={`h-[112px] w-[112px] object-cover rounded-full`} />
                    <div className="relative">
                        <label htmlFor="file-upload" className="w-[200px] px-8 py-5 bg-gray-300 rounded-full font-bold cursor-pointer">
                            Télécharger ma photo
                        </label>
                        <input type="file" id="file-upload" className="hidden" name='logo' />
                    </div>
                    <div>
                        <button type="button" className="font-bold w-fit h-14 bg-gray-200 text-black py-2 px-8 rounded-full">
                            Supprimer
                        </button>
                    </div>
                </div>
                <div className="mt-8 md:px-36">
                    <div className='grid grid-cols-1 mt-6 lg:grid-cols-2 lg:gap-16'>
                        <div>
                            <label>
                                <p>Nom de l’organisation*</p>
                                <Field type='text' name='name' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            </label>
                            <label>
                                <p>Type d’organisation</p>
                                <Field type='text' name='type' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            </label>
                            <label>
                                <p>Email*</p>
                                <Field type='email' name='email' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            </label>
                            <label>
                                <p>Téléphone*</p>
                                <Field type='text' name='phone' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            </label>
                            <label>
                                <p>Site web de l’organisation</p>
                                <Field type='text' name='website' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            </label>
                        </div>
                        <div>
                            <label>
                                <p>Adresse*</p>
                                <Field type='text' name='address' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            </label>
                            <div className='grid grid-cols-2 max-w-[432px] gap-4'>
                                <label>
                                    <p>Code postal*</p>
                                    <Field type='text' name='zipcode' className='bg-gray-100 rounded-md px-4 py-2 w-[210px] h-[43px] mt-1 mb-4' />
                                </label>
                                <label>
                                    <p>Ville*</p>
                                    <Field type='text' name='city' className='bg-gray-100 rounded-md px-4 py-2 w-[210px] h-[43px] mt-1 mb-4' />
                                </label>
                            </div>
                            <div className='grid grid-cols-2 max-w-[432px] gap-4'>
                                <label>
                                    <p>Pays*</p>
                                    <Field name="country" as="select" className='bg-gray-100 rounded-md px-4 py-2 w-[210px] h-[43px] mt-1 mb-4' >
                                        <option value="FR">France</option>
                                    </Field>
                                </label>
                            </div>
                            <label>
                                <p>N° de Siret</p>
                                <Field type='text' name='siret' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4 mt-1 mb-4' />
                            </label>
                            <label>
                                <p>TVA intracommunautaire</p>
                                <Field type='text' name='vat' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4 mt-1 mb-4' />
                            </label>
                        </div>
                    </div>
                    <div className='mt-10'>
                        <p className='font-bold mb-4'>Présentation</p>
                        <p className='text-sm w-96 lg:w-full'>Fiche de présentation associée aux concours publiés par l’organisation</p>
                        <textarea
                            name='description'
                            defaultValue={user.organizations[0].description}
                            className='bg-gray-100 w-full h-[242px] mt-3 rounded-md p-4 text-sm mb-4 lg:w-[929px]' 
                            placeholder='Présentez brièvement votre organisation...'  
                        />
                    </div>
                    <div className='mt-10'>
                        <p className='font-bold mb-4'>Réseaux sociaux de l’organisation</p>
                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                            <label>
                                <p>Votre page Facebook</p>
                                <Field type='text' name='facebook' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            </label>
                            <label>
                                <p>Votre chaîne Youtube</p>
                                <Field type='text' name='youtube' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            </label>
                        </div>
                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                            <label>
                                <p>Votre page Instagram</p>
                                <Field type='text' name='instagram' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            </label>
                            <label>
                                <p>Votre compte Twitter</p>
                                <Field type='text' name='twitter' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            </label>
                        </div>
                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                            <label>
                                <p>Votre page Linkedin</p>
                                <Field type='text' name='linkedin' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            </label>
                            <label>
                                <p>Votre compte TikTok</p>
                                <Field type='text' name='tiktok' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            </label>
                        </div>
                    </div>
                    <button className='bg-black text-white font-semibold px-14 py-5 rounded-full mt-10'>Mettre à jour</button>
                </div>
            </div>
            </Form>
        </Formik>
    );
}

export default MyOrganizationTab;