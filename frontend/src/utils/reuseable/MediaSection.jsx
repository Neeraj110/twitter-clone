/* eslint-disable react/prop-types */

const MediaSection = ({ image, video }) => (
  <>
    {image && (
      <img
        src={image}
        loading="lazy"
        alt="Post Image"
        className="w-[90%] md:w-[68%] h-[22rem] md:h-[85%] mb-4 rounded-md  object-cover object-center"
      />
    )}
    {video && (
      <video
        controls
        loading="lazy"
        src={video}
        className="w-[90%] h-[20rem] md:h-[28rem] mb-4 rounded-md  object-cover object-center"
      >
        Your browser does not support the video tag.
      </video>
    )}
  </>
);

export default MediaSection;
