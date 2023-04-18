const AdSpaceCard = (props) => {
    const { ad, index } = props;

    return (
      <div
        className={`bg-gray-300 flex items-center justify-center h-80 ${index === undefined ? 'w-90' : index === 0 ? 'w-2/3' : 'w-1/3'}`}
      >
        <p className="text-center">{ad.name}</p>
      </div>
    );
  };
  
  export default AdSpaceCard;  