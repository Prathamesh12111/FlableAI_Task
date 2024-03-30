import { useState } from "react";
import PropTypes from "prop-types";
import {
  MdComputer,
  MdPerson,
  MdThumbUp,
  MdThumbDown,
  MdContentCopy,
} from "react-icons/md";
import moment from "moment";
import Markdown from "./Markdown";
import axios from "axios";

const Message = (props) => {
  const { id, createdAt, text, ai = false } = props.message;
  const [copied, setCopied] = useState(false);
  const [thumbsUpClicked, setThumbsUpClicked] = useState(false);
  const [thumbsDownClicked, setThumbsDownClicked] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleThumbsUpClick = async () => {
    setThumbsUpClicked(!thumbsUpClicked);
    try {
      await axios.post("http://localhost:5000/storeFeedback", {
        messageId: id,
        feedback: "thumbs-up",
      });
    } catch (error) {
      console.error("Error storing thumbs up feedback:", error);
    }
  };

  const handleThumbsDownClick = async () => {
    setThumbsDownClicked(!thumbsDownClicked);
    try {
      await axios.post("http://localhost:5000/storeFeedback", {
        messageId: id,
        feedback: "thumbs-down",
      });
    } catch (error) {
      console.error("Error storing thumbs down feedback:", error);
    }
  };

  return (
    <div
      key={id}
      className={`flex items-end my-2 gap-2 ${
        ai ? "flex-row-reverse justify-end" : "flex-row justify-end"
      }`}
    >
      <div
        className={`w-screen overflow-hidden chat ${
          ai ? "chat-start" : "chat-end"
        }`}
      >
        <div className="chat-bubble text-neutral-content">
          <Markdown markdownText={text} />
          <div className={`${ai ? "text-left" : "text-right"} text-xs`}>
            {moment(createdAt).calendar()}
          </div>
        </div>
      </div>

      <div className="avatar">
        <div className="w-8 border rounded-full border-slate-400">
          {ai ? (
            <MdComputer className="w-6 h-full m-auto" />
          ) : (
            <MdPerson className="w-6 h-full m-auto" />
          )}
        </div>
      </div>

      {ai && (
        <div className="flex items-center">
          <MdThumbUp
            className={`500 mr-2 cursor-pointer ${
              thumbsUpClicked ? "text-green-700" : ""
            }`}
            size={20}
            onClick={handleThumbsUpClick}
          />
          <MdThumbDown
            className={`500 mr-2 cursor-pointer ${
              thumbsDownClicked ? "text-red-700" : ""
            }`}
            size={20}
            onClick={handleThumbsDownClick}
          />
          <MdContentCopy
            className={`text-blue-500 cursor-pointer ${
              copied ? "opacity-50" : ""
            } mr-2`}
            size={20}
            onClick={copyToClipboard}
          />
        </div>
      )}
    </div>
  );
};

export default Message;

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    createdAt: PropTypes.number.isRequired,
    text: PropTypes.string,
    ai: PropTypes.bool,
    selected: PropTypes.string,
  }).isRequired,
};
