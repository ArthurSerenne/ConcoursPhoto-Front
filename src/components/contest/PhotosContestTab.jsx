import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import PhotoCard from '../PhotoCard';

const PhotosContestTab = ({ user, contest, setContest, uniquePhotographers, goBack }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    const totalPages = Math.ceil(contest.photos.filter((photo) => photo.status === true).length / itemsPerPage);

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(event.target.value);
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    return (
        <>
            <h2 className="flex items-center text-text-2xl font-normal not-italic mb-10">
                {contest.photos.filter((photo) => photo.status === true).length} photos soumises par {uniquePhotographers} photographes
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
                {contest.photos
                    .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
                    .filter(
                        (photo) =>
                            photo.status === true
                    )
                    .slice(currentPage * itemsPerPage, (currentPage * itemsPerPage) + itemsPerPage)
                    .map(
                        (photo) => <PhotoCard photo={photo} key={photo.id} />
                    )}
            </div>
            <div>
                <div className="mt-6 mb-6">
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
                    breakLabel={"..."}
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"flex items-center place-content-center justify-center content-center justify-self-center"}
                    activeClassName={"text-black"}
                    breakClassName={"mx-2"}
                    pageClassName={"page-item mx-1"}
                    previousClassName={"page-item mx-1"}
                    nextClassName={"page-item mx-1 text-lg"}
                    pageLinkClassName={"page-link px-4 pt-2.5 pb-3 bg-gray-200 rounded-full text-xl hover:bg-gray-100"}
                    previousLinkClassName={"bg-gray-200 px-2.5 pt-2 pb-2.5 text-2xl rounded-full hover:bg-gray-100"}
                    nextLinkClassName={"bg-gray-200 px-2.5 pt-2 pb-2.5 text-2xl rounded-full hover:bg-gray-100"}
                    forcePage={currentPage}
                />
            </div>
            <div className="mx-auto mt-10 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
                <Link onClick={goBack} className="rounded-[44px] bg-button-grey px-[25px] py-3.5 mr-4 items-center flex w-fit">
                    <AiOutlineArrowLeft className='mr-2' /> Retour
                </Link>
            </div>
        </>
    );
};

export default PhotosContestTab;
