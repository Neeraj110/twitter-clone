/* eslint-disable react/prop-types */

const MediaSection = ({ image, video }) => (
  <>
    {image && (
      <img
        src={image}
        alt="Post Image"
        className="w-full h-auto mb-4 rounded-md object-cover"
        style={{ aspectRatio: "16/9", maxHeight: "400px", objectFit: "cover" }}
      />
    )}
    {video && (
      <video
        controls
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
