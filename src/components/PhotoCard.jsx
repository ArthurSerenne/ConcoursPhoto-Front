import ImageDisplay from '../components/ImageDisplay';
import { BiLike } from "react-icons/bi";
import { RiUserShared2Line } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";

const PhotoCard = (props) => {   
    return (
        <div className='max-w-lg max-h-[330px] rounded-b-lg mb-12'>
            <div className="flex items-center max-h-[300px] justify-center hover:scale-105 ease-in-out duration-300 cursor-pointer">
                <ImageDisplay imageName={props.photo.file} name={props.photo.member.username} radius='items-center justify-center rounded-xl max-h-[300px] w-full object-cover' modalEnabled={true} />
            </div>
            <div className='mt-4'>
                <div className='flex justify-between'>
                    <p className='text-xs not-italic bg-gray-100 rounded-full py-2 px-2 flex items-end'>
                        <RiUserShared2Line className='mr-2 text-base' /> {props.photo.name}
                    </p>
                    <div className='flex'>
                        <p className="bg-gray-100 rounded-full py-2 px-2 text-xs uppercase flex items-end mr-4"><AiOutlineEye className='mr-2 text-base' /> 1257</p>
                        <p className="bg-gray-400 text-white rounded-full py-2 px-2 text-xs uppercase flex items-end hover:bg-gray-300 ease-in-out duration-300 cursor-pointer"><BiLike className='mr-2 text-base' /> Voter</p>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default PhotoCard;
