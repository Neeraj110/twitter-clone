/* eslint-disable react/prop-types */

const MediaSection = ({ image, video }) => (
  <>
    {image && (
      <img
        src={image}
        loading="lazy"
        alt="Post Image"
        className="w-[80%] h-[20rem] md:h-[28rem] mb-4 rounded-md object-cover"
      />
    )}
    {video && (
      <video
        controls
        loading="lazy"
        src={video}
        className="w-full h-auto mb-4 rounded-md"
        style={{ aspectRatio: "16/9", maxHeight: "400px", objectFit: "cover" }}
      >
        Your browser does not support the video tag.
      </video>
    )}
  </>
);

export default MediaSection;
