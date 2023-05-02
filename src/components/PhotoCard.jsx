import ImageDisplay from '../components/ImageDisplay';
import { BiLike } from 'react-icons/bi';
import { RiUserShared2Line } from 'react-icons/ri';
import { AiOutlineEye } from 'react-icons/ai';

const PhotoCard = (props) => {
  return (
    <div className="mb-12 max-h-[330px] max-w-lg rounded-b-lg">
      <div className="flex max-h-[300px] cursor-pointer items-center justify-center duration-300 ease-in-out hover:scale-105">
        <ImageDisplay
          imageName={props.photo.file}
          name={props.photo.member.username}
          radius="items-center justify-center rounded-xl max-h-[300px] w-full object-cover"
          modalEnabled={true}
        />
      </div>
      <div className="mt-4">
        <div className="flex justify-between">
          <p className="flex items-end rounded-full bg-gray-100 px-2 py-2 text-xs not-italic">
            <RiUserShared2Line className="mr-2 text-base" />{' '}
            {props.photo.member.username}
          </p>
          <div className="flex">
            <p className="mr-4 flex items-end rounded-full bg-gray-100 px-2 py-2 text-xs uppercase">
              <AiOutlineEye className="mr-2 text-base" /> 1257
            </p>
            <p className="flex cursor-pointer items-end rounded-full bg-gray-400 px-2 py-2 text-xs uppercase text-white duration-300 ease-in-out hover:bg-gray-300">
              <BiLike className="mr-2 text-base" /> Voter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
