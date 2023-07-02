import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseLine,
  RiUpload2Line,
} from 'react-icons/ri';
import PhotoCard from '../PhotoCard';

const PhotosContestTab = ({
  user,
  contest,
  setContest,
  uniquePhotographers,
  goBack,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isModalOpen, setModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageName, setUploadedImageName] = useState('');

  const totalPages = Math.ceil(
    contest.photos.filter((photo) => photo.status === true).length /
      itemsPerPage
  );

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleEditClick = () => {
    setModalOpen(true);
  };

  const closeModalWhenClickedOutside = (e) => {
    if (e.target.classList.contains('fixed')) {
      handleCancelClick();
    }
  };

  const handleCancelClick = () => {
    setModalOpen(false);
    setUploadedImage(null);
    setUploadedImageName('');
  };

  const handleUploadProcess = (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return axios
      .post(`${process.env.REACT_APP_IMAGE_BASE_URL}`, formData)
      .then((response) => {
        setUploadedImage(response.data.newFilename);
        setUploadedImageName(file.name);
      });
  };

  const handleUploadClick = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier l'extension du fichier
      const validExtensions = ['image/jpeg', 'image/png'];
      if (!validExtensions.includes(file.type)) {
        alert(
          'Format de fichier non supporté. Seuls les formats JPG et PNG sont autorisés.'
        );
        return;
      }

      // Vérifier la taille du fichier (1 Mo max)
      const maxSizeInBytes = 1048576;
      if (file.size > maxSizeInBytes) {
        alert("La taille de l'image dépasse la limite autorisée de 1 Mo.");
        return;
      }

      // Utilisation de toasts
      toast.promise(handleUploadProcess(file), {
        pending: "Téléchargement de l'image...",
        success: 'Image téléchargée avec succès !',
        error: "Une erreur est survenue lors du téléchargement de l'image.",
      });
    }
  };

  const handleDeleteProcess = () => {
    const deleteUrl = `${process.env.REACT_APP_IMAGE_BASE_URL}`;
    const params = { filename: uploadedImage };

    return axios.delete(deleteUrl, { data: params }).then((response) => {
      setUploadedImage('https://placehold.co/200');
      setUploadedImageName('');
    });
  };

  const handleDeleteClick = () => {
    if (uploadedImage) {
      // Utilisation de toasts
      toast.promise(handleDeleteProcess(), {
        pending: "Suppression de l'image...",
        success: 'Image supprimée avec succès !',
        error: "Une erreur est survenue lors de la suppression de l'image.",
      });
    }
  };

  const saveAndUpdateProcess = () => {
    let formattedName = uploadedImage.split('-')[0]; // 'chien' à partir de "chien-64a007d05ae37.jpg"
    formattedName = 'Image de ' + formattedName; // "Image de chien"

    // Obtenir la date actuelle en tenant compte du fuseau horaire
    let submissionDate = new Date().toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      hour12: false,
    });
    submissionDate = submissionDate.replace(',', ''); // "2023-07-01 13:02:46"

    return axios
      .post(process.env.REACT_APP_API_URL + '/photos.json', {
        member: `${process.env.REACT_APP_API_URL}/members/${user.member.id}`,
        contest: `${process.env.REACT_APP_API_URL}/contests/${contest.id}`,
        file: uploadedImage,
        name: formattedName,
        status: true,
        submissionDate: submissionDate,
        voteCount: 0,
        prizeWon: false,
        prizeRank: 0,
        view: 0,
      })
      .then((response) => {
        setModalOpen(false);
        // Handle success
      });
  };

  const saveAndUpdate = () => {
    // Utilisation de toasts
    toast.promise(saveAndUpdateProcess(), {
      pending: "Enregistrement de l'image...",
      success: 'Image enregistrée avec succès !',
      error: "Une erreur est survenue lors de l'enregistrement de l'image.",
    });
  };

  return (
    <>
      <h2 className="mb-10 flex items-center text-text-2xl font-normal not-italic">
        {contest.photos.filter((photo) => photo.status === true).length} photos
        soumises par {uniquePhotographers} photographes
      </h2>
      <div className="grid gap-5 md:grid-cols-3">
        {contest.photos
          .sort(
            (a, b) => new Date(b.submissionDate) - new Date(a.submissionDate)
          )
          .filter((photo) => photo.status === true)
          .slice(
            currentPage * itemsPerPage,
            currentPage * itemsPerPage + itemsPerPage
          )
          .map((photo) => (
            <PhotoCard photo={photo} key={photo.id} />
          ))}
      </div>
      <div className="mx-auto mt-10 flex items-center justify-center sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        {user &&
          user.organizations &&
          contest.organization &&
          user.organizations.some(
            (org) => org.id === contest.organization.id
          ) && (
            <button
              className="gap-5 rounded-[44px] bg-black px-[30px] py-3.5 text-center text-base font-bold not-italic leading-[19px] text-white"
              onClick={handleEditClick}
            >
              Soumettre une photo
            </button>
          )}
      </div>
      {user &&
      user.organizations &&
      contest.organization &&
      user.organizations.some((org) => org.id === contest.organization.id) ? (
        <>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCancelClick}
            contentLabel="Add Photo Modal"
            overlayClassName=""
            className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-80 p-4"
            overlayRef={(overlay) => {
              if (overlay) {
                overlay.addEventListener('click', closeModalWhenClickedOutside);
              }
            }}
          >
            <div className="max-h-[750px] max-w-[1172px] overflow-auto rounded-lg bg-white p-7">
              <div className="flex justify-between">
                <h1 className="mb-2 text-xl font-bold">Soumettre une photo</h1>
                <button
                  onClick={handleCancelClick}
                  className="absolute right-2.5 top-2.5"
                >
                  <RiCloseLine />
                </button>
              </div>
              <p className="flex items-center text-sm font-bold not-italic leading-[17px] text-black">
                Vous pouvez importer une photo ou plusieurs selon le règlement
                du concours, voici les critères à respecter :
              </p>
              <p className="flex items-center text-sm font-normal not-italic leading-[17px] text-black">
                Formats supportés : JPG, PNG | Poids : 1 Mo max par photo (la
                photo peut être en mode portrait, carré ou paysage)
              </p>
              <div className="border border-solid border-[#d9d9d9]">
                {uploadedImage && uploadedImageName ? (
                  <div>
                    <img
                      src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${uploadedImage}`}
                      alt={uploadedImageName}
                      style={{ maxWidth: '100%' }}
                    />
                    <span>Fichier actuel : {uploadedImageName}</span>
                  </div>
                ) : (
                  <div>
                    <img
                      src="https://placehold.co/200"
                      alt="Placeholder"
                      style={{ maxWidth: '100%' }}
                    />
                    <span>Fichier actuel : placeholder.jpg</span>
                  </div>
                )}
                <input
                  className="gap-5 rounded-[44px] bg-black px-[30px] py-3.5 text-base font-bold not-italic leading-[19px] text-white"
                  style={{ display: 'none' }}
                  id="photo-upload"
                  name="photo-upload"
                  type="file"
                  onChange={handleUploadClick}
                />
                <label
                  htmlFor="photo-upload"
                  className="mr-4 cursor-pointer gap-5 rounded-[44px] bg-[#D9D9D9] px-[30px] py-3.5 text-sm font-bold not-italic leading-[17px] text-[#333333]"
                >
                  Télécharger <RiUpload2Line />
                </label>
                <button
                  className="gap-5 rounded-[44px] bg-[#F1F1F1] px-[30px] py-3.5 text-sm font-bold not-italic leading-[17px] text-[#333333]"
                  onClick={handleDeleteClick}
                >
                  Supprimer
                </button>
              </div>
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
                  Importer
                </button>
              </div>
            </div>
          </Modal>
        </>
      ) : (
        <></>
      )}
      <div>
        <div className="mb-6 mt-6">
          <label htmlFor="items-per-page" className="mr-2">
            Afficher par :
          </label>
          <select
            name="items-per-page"
            id="items-per-page"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="rounded border px-2 py-1"
          >
            <option value={3}>3</option>
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
          </select>
        </div>
        <ReactPaginate
          previousLabel={<RiArrowLeftSLine />}
          nextLabel={<RiArrowRightSLine />}
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={
            'flex items-center place-content-center justify-center content-center justify-self-center'
          }
          activeClassName={'text-black'}
          breakClassName={'mx-2'}
          pageClassName={'page-item mx-1'}
          previousClassName={'page-item mx-1'}
          nextClassName={'page-item mx-1 text-lg'}
          pageLinkClassName={
            'page-link px-4 pt-2.5 pb-3 bg-gray-200 rounded-full text-xl hover:bg-gray-100'
          }
          previousLinkClassName={
            'bg-gray-200 px-2.5 pt-2 pb-2.5 text-2xl rounded-full hover:bg-gray-100'
          }
          nextLinkClassName={
            'bg-gray-200 px-2.5 pt-2 pb-2.5 text-2xl rounded-full hover:bg-gray-100'
          }
          forcePage={currentPage}
        />
      </div>
    </>
  );
};

export default PhotosContestTab;
