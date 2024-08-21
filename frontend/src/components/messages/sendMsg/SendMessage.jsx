import { useState } from "react";
import { FiImage, FiVideo } from "react-icons/fi";
import { useSendMessage } from "../../../slices/coversation/messageApi/sendMessage";

function SendMessage() {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null); // Handle image file
  const [videoFile, setVideoFile] = useState(null); // Handle video file
  const { sendMessage, loading } = useSendMessage();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text && !imageFile && !videoFile) return;
    await sendMessage(text, imageFile, videoFile);
    setText("");
    setImageFile(null);
    setVideoFile(null);
  };

  return (
    <div className="bg-background p-4 border-t border-muted">
      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <input
          className=" border border-input bg-background text-sm rounded-2xl md:w-[65%] p-2"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <label htmlFor="imageInput" className="cursor-pointer">
          <FiImage className="text-2xl hover:text-blue-600" />
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])} // Handle image selection
            className="hidden"
          />
        </label>
        <label htmlFor="videoInput" className={`cursor-pointer`}>
          <FiVideo className="text-2xl hover:text-blue-600" />
          <input
            id="videoInput"
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])} // Handle video selection
            className="hidden"
          />
        </label>
        <button
          className="bg-white text-black py-2 rounded-[100px] px-4"
          type="submit"
          disabled={loading}
        >
          {/* <FiSend /> */}
          Send
        </button>
        <div className=""></div>
      </form>
    </div>
  );
}

export default SendMessage;
