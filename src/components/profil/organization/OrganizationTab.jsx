import React, { useState, useEffect } from 'react';
import { Field, ErrorMessage } from 'formik';
import myImage from '../../../assets/images/user-icon.png';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import OrganizationTypeEnum from '../../enums/OrganizationTypeEnum';
import 'react-toastify/dist/ReactToastify.css';

const OrganizationTab = (organization) => {
    const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
    console.log(organization);
    const imagePath = organization?.organization?.logo ? `${baseUrl}${organization.organization.logo}` : myImage;
    const [displayedImage, setDisplayedImage] = useState(imagePath);
    const [originalImage, setOriginalImage] = useState(imagePath);
    const [imageRemoved, setImageRemoved] = useState(false);

    useEffect(() => {
        setDisplayedImage(imagePath);
        setOriginalImage(imagePath);
    }, [imagePath]);

    const loadZipCode = (inputValue) => {
        return axios.get(process.env.REACT_APP_API_URL + '/cities.json', {
            params: {
                zip_code: inputValue
            }
        }).then(res => {
            return res.data.map(city => ({
                value: city.id,
                label: city.zip_code
            }));
        });
    };

    const loadCities = (inputValue) => {
        return axios.get(process.env.REACT_APP_API_URL + '/cities.json', {
            params: {
                name: inputValue
            }
        }).then(res => {
            return res.data.map(city => ({
                value: `${process.env.REACT_APP_API_URL}/cities/${city.id}`,
                label: city.name
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
            if (window.confirm("Voulez-vous vraiment supprimer cette image ?")) {
                setDisplayedImage(null);
                setOriginalImage(null);
                setImageRemoved(true);
            }
        };

    return (
        <div>
            <div className='flex flex-col lg:flex-row gap-6 items-center'>
                <img src={displayedImage || myImage} className={`h-[112px] w-[112px] object-cover rounded-full`} />
                <div className="relative">
                    <label htmlFor="file-upload" className="w-[200px] px-8 py-5 bg-gray-300 rounded-full font-bold cursor-pointer hover:bg-gray-200">
                        Télécharger ma photo
                    </label>
                    <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    name='logo'
                    onChange={handleImageChange}
                    />
                </div>
                <div>
                    <button
                        type="button"
                        className="font-bold w-fit h-14 bg-gray-200 text-black py-2 px-8 rounded-full hover:bg-gray-100"
                        onClick={handleImageRemove}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
            <div className="mt-8">
                <div className='grid grid-cols-1 mt-6 lg:grid-cols-2 lg:gap-16'>
                    <div>
                        <label>
                            <p>Nom de l’organisation*</p>
                            <Field type='text' name='name' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            <ErrorMessage name='name' component='div' className='text-red-500' />
                        </label>
                        <label>
                            <p>Type d’organisation</p>
                            <Field as='select' name='type' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4'>
                                {Object.entries(OrganizationTypeEnum).map(([key, value]) => (
                                    <option value={key} key={key}>
                                        {value}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name='type' component='div' className='text-red-500' />
                        </label>
                        <label>
                            <p>Email*</p>
                            <Field type='email' name='email' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            <ErrorMessage name='email' component='div' className='text-red-500' />
                        </label>
                        <label>
                            <p>Téléphone*</p>
                            <Field type='text' name='phone' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            <ErrorMessage name='phone' component='div' className='text-red-500' />
                        </label>
                        <label>
                            <p>Site web de l’organisation</p>
                            <Field type='text' name='website' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            <ErrorMessage name='website' component='div' className='text-red-500' />
                        </label>
                    </div>
                    <div>
                        <label>
                            <p>Adresse*</p>
                            <Field type='text' name='address' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                            <ErrorMessage name='address' component='div' className='text-red-500' />
                        </label>
                        <div className='grid grid-cols-2 max-w-[432px] gap-4'>
                        <label>
                            <p>Code postal*</p>
                            <Field name="zipcode">
                                {({ field, form }) => (
                                    <AsyncSelect
                                    {...field}
                                    className='bg-gray-100 rounded-md p-1 w-[210px] h-[43px] mt-1 mb-4 gray-select'
                                    loadOptions={loadZipCode}
                                    onChange={option => form.setFieldValue(field.name, option)}
                                    />
                                )}
                            </Field>
                            <ErrorMessage name='zipcode' component='div' className='text-red-500' />
                        </label>
                        <label>
                            <p>Ville*</p>
                            <Field name="city">
                                {({ field, form }) => (
                                    <AsyncSelect
                                    {...field}
                                    className='bg-gray-100 rounded-md p-1 w-[210px] h-[43px] mt-1 mb-4 gray-select'
                                    loadOptions={loadCities}
                                    onChange={option => form.setFieldValue(field.name, option)}
                                    />
                                )}
                            </Field>
                            <ErrorMessage name='city' component='div' className='text-red-500' />
                        </label>
                    </div>
                    <div className='grid grid-cols-2 max-w-[432px] gap-4'>
                        <label>
                            <p>Pays*</p>
                            <Field name="country" as="select" className='bg-gray-100 rounded-md px-4 py-2 w-[210px] h-[43px] mt-1 mb-4' >
                                <option value="FR">France</option>
                            </Field>
                            <ErrorMessage name='country' component='div' className='text-red-500' />
                        </label>
                    </div>
                    <label>
                        <p>N° de Siret</p>
                        <Field type='text' name='siret' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                        <ErrorMessage name='siret' component='div' className='text-red-500' />
                    </label>
                    <label>
                        <p>TVA intracommunautaire</p>
                        <Field type='text' name='vat' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                        <ErrorMessage name='vat' component='div' className='text-red-500' />
                    </label>
                </div>
            </div>
            <div className='mt-10'>
                <p className='font-bold mb-4'>Présentation</p>
                <p className='text-sm w-96 lg:w-full'>Fiche de présentation associée aux concours publiés par l’organisation</p>
                <Field
                    as='textarea'
                    name='description'
                    className='bg-gray-100 w-full mt-3 rounded-md px-4 pt-4 h-[242px] text-sm mb-4 lg:w-[929px]'
                    placeholder='Présentez brièvement votre organisation...'
                />
                <ErrorMessage name='description' component='div' className='text-red-500' />
            </div>
            <div className='mt-10'>
                <p className='font-bold mb-4'>Réseaux sociaux de l’organisation</p>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                    <label>
                        <p>Votre page Facebook</p>
                        <Field type='text' name='facebook' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                        <ErrorMessage name='facebook' component='div' className='text-red-500' />
                    </label>
                    <label>
                        <p>Votre chaîne Youtube</p>
                        <Field type='text' name='youtube' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                        <ErrorMessage name='youtube' component='div' className='text-red-500' />
                    </label>
                </div>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                    <label>
                        <p>Votre page Instagram</p>
                        <Field type='text' name='instagram' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                        <ErrorMessage name='instagram' component='div' className='text-red-500' />
                    </label>
                    <label>
                        <p>Votre compte Twitter</p>
                        <Field type='text' name='twitter' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                        <ErrorMessage name='twitter' component='div' className='text-red-500' />
                    </label>
                </div>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                    <label>
                        <p>Votre page Linkedin</p>
                        <Field type='text' name='linkedin' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                        <ErrorMessage name='linkedin' component='div' className='text-red-500' />
                    </label>
                    <label>
                        <p>Votre compte TikTok</p>
                        <Field type='text' name='tiktok' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                        <ErrorMessage name='tiktok' component='div' className='text-red-500' />     
                    </label>
                </div>
            </div>
            <button className='bg-black text-white font-semibold px-14 py-5 rounded-full mt-10 hover:bg-gray-500' type='submit'>Sauvergarder</button>
        </div>
    </div>
    );
}

export default OrganizationTab;
