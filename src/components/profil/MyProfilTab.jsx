import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Formik, Form, Field } from 'formik';
import { format, parseISO } from "date-fns";
import myImage from '../../assets/images/user-icon.png';
import axiosInstance from '../AxiosInstance';

const MyProfilTab = () => {
  const { isAuthenticated, user, isLoading, reloadUser } = useAuth();
    const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
    const imagePath = user.member.photo ? `${baseUrl}${user.member.photo}` : myImage;
    const [displayedImage, setDisplayedImage] = useState(imagePath);
    const formattedInitialValue = format(parseISO(user.birthdate), "yyyy-MM-dd");
    const [imageFile, setImageFile] = useState(null);
    
    useEffect(() => {
        setDisplayedImage(imagePath);
    }, [imagePath]);

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

        const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
            setDisplayedImage(reader.result);
            };
            reader.readAsDataURL(file);
            setImageFile(file);
        }
        };
      
      const handleImageRemove = () => {
        if (window.confirm("Voulez-vous vraiment supprimer cette image ?")) {
          setDisplayedImage(null);
        }
      };

      const separateEntityData = (values) => {
        const entity1Data = {
            firstname: values.firstname,
            lastname: values.lastname,
            gender: values.gender,
            birthdate: values.birthdate,
            address: values.address,
            email: values.email,
            password: values.password ? values.password : user.password,
        };

        const entity2Data = {
            situation: values.situation,
            category: values.categorie,
            username: values.username,
            description: values.description,
            website: values.website,
        };

        const entity3Data = {
            facebook: values.facebook,
            youtube: values.youtube,
            instagram: values.instagram,
            twitter: values.twitter,
            linkedin: values.linkedin,
            tiktok: values.tiktok,
        };
      
        return { entity1Data, entity2Data, entity3Data };
      };

      const handleSubmit = async (values, { setSubmitting }) => {
        const { entity1Data, entity2Data, entity3Data } = separateEntityData(values);

        if (imageFile) {
            entity1Data.photo = displayedImage;
          }

        const data = {
            entity1Data,
            entity2Data,
            entity3Data,
        };

          console.log(displayedImage);
        
          try {
            const response = await axiosInstance.patch(
              `${process.env.REACT_APP_API_URL}/user_update`,
              data,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
        
            if (response.status === 200) {
              console.log("Formulaire soumis avec succès");
              await reloadUser();
            } else {
              console.error("Erreur lors de la soumission du formulaire");
            }
          } catch (error) {
          console.error("Erreur lors de la soumission du formulaire:", error);
        } finally {
          setSubmitting(false);
        }
      };

    return (
        <Formik
        onSubmit={handleSubmit}
        initialValues={{
            photo: user.member?.photo ?? "",
            gender: user.gender ?? "",
            lastname: user.lastname ?? "",
            firstname: user.firstname ?? "",
            address: user.address ?? "",
            city: user.city?.name ?? "",
            zipcode: user.city?.zip_code ?? "",
            email: user.email ?? "",
            passwword: user.passwword ?? "",
            username: user.member?.username ?? "",
            situation: user.member?.situation ?? "",
            categorie: user.member?.category ?? "",
            description: user.member?.description ?? "",
            website: user.member?.website ?? "",
            facebook: user.member?.socialNetwork?.facebook ?? "",
            youtube: user.member?.socialNetwork?.youtube ?? "",
            linkedin: user.member?.socialNetwork?.linkedin ?? "",
            tiktok: user.member?.socialNetwork?.tiktok ?? "",
            instagram: user.member?.socialNetwork?.instagram ?? "",
            twitter: user.member?.socialNetwork?.twitter ?? "",
          }}>
        <Form>
        <div className="sm:max-w-screen-sm 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md">
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
                    name='photo'
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
            <div className="mt-8 md:px-36">
                <div className='flex flex-col gap-4 lg:flex-row'>
                    <label htmlFor="male">
                        <Field
                            type="radio"
                            className='mr-3 scale-150 bg-black'
                            name='gender'
                            id="male"
                            value='male'
                        />
                        Homme
                    </label>
                    <label htmlFor="female">
                        <Field
                            type="radio"
                            className='mr-3 scale-150'
                            name='gender'
                            id="female"
                            value='female'
                        />
                        Femme
                    </label>
                    <label htmlFor="other">
                        <Field
                            type="radio"
                            className='mr-3 scale-150'
                            name='gender'
                            id="other"
                            value='other'
                        />
                        Non binaire
                    </label>
                </div>
                <div className='grid grid-cols-1 mt-6 lg:grid-cols-2 lg:gap-16'>
                    <div>
                        <label>
                            <p>Prénom*</p>
                            <Field type='text' name='firstname' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                        </label>
                        <label>
                            <p>Nom*</p>
                            <Field type='text' name='lastname' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                        </label>
                        <div className='grid grid-cols-2 max-w-[432px] gap-4'>
                            <label>
                                <p>Date de naissance*</p>
                                <Field type='date' name='birthdate' defaultValue={formattedInitialValue} className='bg-gray-100 rounded-md px-4 py-2 w-[210px] h-[43px] mt-1 mb-4' />
                            </label>
                            <label>
                                <p>Vous êtes*</p>
                                <Field type='text' name='situation' className='bg-gray-100 rounded-md px-4 py-2 w-[210px] h-[43px] mt-1 mb-4' />
                            </label>
                        </div>
                        <label>
                            <p>Email*</p>
                            <Field type='text' name='email' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                        </label>
                        <label>
                            <p>Mot de passe*</p>
                            <Field type='text' name='password' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4 text-sm' placeholder='8 caractères min dont 1 chiffre et 1 lettre majuscule' />
                        </label>
                    </div>
                    <div>
                        <label>
                            <p>Adresse</p>
                            <Field type='text' name='address' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                        </label>
                        <div className='grid grid-cols-2 max-w-[432px] gap-4'>
                            <label>
                                <p>Code postal</p>
                                <Field type='text' name='zipcode' className='bg-gray-100 rounded-md px-4 py-2 w-[210px] h-[43px] mt-1 mb-4' />
                            </label>
                            <label>
                                <p>Ville</p>
                                <Field type='text' name='city' className='bg-gray-100 rounded-md px-4 py-2 w-[210px] h-[43px] mt-1 mb-4' />
                            </label>
                        </div>
                        <div className='grid grid-cols-2 max-w-[432px] gap-4'>
                            <label>
                                <p>Pays</p>
                                <Field name="country" as="select" className='bg-gray-100 rounded-md px-4 py-2 w-[210px] h-[43px] mt-1 mb-4' >
                                    <option value="FR">France</option>
                                </Field>
                            </label>
                            <label>
                                <p>Langue</p>
                                <Field name="langage" as="select" className='bg-gray-100 rounded-md px-4 py-2 w-[210px] h-[43px] mt-1 mb-4' >
                                    <option value="fr">Français</option>
                                </Field>
                            </label>
                        </div>
                        <label>
                            <p>Pseudo</p>
                            <Field type='text' name='username' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4 mt-1 mb-4' />
                        </label>
                    </div>
                </div>
                <div className='mt-10'>
                    <p className='font-bold mb-4'>Si vous êtes photographe</p>
                    <p className='text-sm w-96 lg:w-full'>Bio / fiche de présentation dans l’annuaire des photographes (si vous avez soumis au moins 1 photo à un concours)</p>
                    <textarea
                        name='description'
                        defaultValue={user.member.description}
                        className='bg-gray-100 w-full h-[242px] mt-3 rounded-md p-4 text-sm mb-4 lg:w-[929px]' 
                        placeholder='Présentez vous brièvement : qui êtes-vous ? que faites-vous ? quelle est votre expérience, vos centres d’intérêts et vos spécialités en tant que photographe ?'  
                    />
                    <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                        <label>
                            <p>Votre catégorie en tant que photographe ?</p>
                            <Field type='text' name='categorie' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                        </label>
                        <label>
                            <p>Votre site web personnel</p>
                            <Field type='text' name='website' className='bg-gray-100 rounded-md px-4 py-2 w-[432px] h-[43px] mt-1 mb-4' />
                        </label>
                    </div>
                </div>
                <div className='mt-10'>
                    <p className='font-bold mb-4'>Vos réseaux sociaux</p>
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
                <button className='bg-black text-white font-semibold px-14 py-5 rounded-full mt-10 hover:bg-gray-500' type='submit'>Mettre à jour</button>
            </div>
        </div>
    </Form>
    </Formik>
    );
}

export default MyProfilTab;