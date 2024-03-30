import { useState, useRef, useEffect, useContext } from "react";
import Message from "./Message";
import { ChatContext } from "../context/chatContext";
import Thinking from "./Thinking";
import { MdSend } from "react-icons/md";
import { replaceProfanities } from "no-profanity";
import { MdUpload } from "react-icons/md";
import { MdShare } from "react-icons/md";
import ChatPDF from "./ChatPDF";
import axios from "axios";

const options = ["Sage", "SEO", "Web Analytics"];

const ChatView = () => {
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const [formValue, setFormValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const [messages, addMessage] = useContext(ChatContext);
  const [exporting, setExporting] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updateMessage = (newValue, ai = false, selected) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
      selected: `${selected}`,
    };
    addMessage(newMsg);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const cleanPrompt = replaceProfanities(formValue);
    const newMsg = cleanPrompt;
    const aiModel = selected;
    setThinking(true);
    setFormValue("");
    updateMessage(newMsg, false, aiModel);

    // store message in database
    try {
      const response = await axios.get("http://localhost:5000/getChatData");
      const responseData = response.data;
      updateMessage(responseData, true, aiModel);
      try {
        await axios.post("http://localhost:5000/storeChatData", {
          prompt: cleanPrompt,
          response: responseData, // Use response from backend
        });
      } catch (error) {
        console.error("Error storing chat data:", error);
      }
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching chat data from backend:", error);
    }
    setThinking(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };

  const handleExport = () => {
    setExporting(true);
  };

  const handleClosePDF = () => {
    setExporting(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <main className="relative flex flex-col h-screen p-1 overflow-hidden dark:bg-light-grey">
      <div className="mx-auto my-4 tabs tabs-boxed w-fit">
        <button className="tab tab-lifted">
          <MdShare size={16} />
          Share
        </button>
        <button className="tab tab-lifted" onClick={handleExport}>
          <MdUpload size={20} />
          Export
        </button>
      </div>

      <section className="flex flex-col flex-grow w-full px-4 overflow-y-scroll sm:px-10 md:px-32">
        {messages.length ? (
          messages.map((message, index) => (
            <Message key={index} message={{ ...message }}/>
          ))
        ) : (
          <div className="flex my-2">
            <div className="w-screen overflow-hidden">
              <div className="chat-bubble text-neutral-content">
                <p className="text-center">Welcome! Ask me anything.</p>
              </div>
            </div>
          </div>
        )}
        {thinking && <Thinking />}
        <span ref={messagesEndRef}></span>
      </section>

      <form
        className="flex flex-col px-10 mb-2 md:px-32 join sm:flex-row"
        onSubmit={sendMessage}
      >
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full sm:w-40 select select-bordered join-item"
        >
          {options.map((option, index) => (
            <option key={index}>{option}</option>
          ))}
        </select>
        <div className="flex items-stretch justify-between w-full">
          <textarea
            ref={inputRef}
            className="w-full grow input input-bordered join-item max-h-[20rem] min-h-[3rem]"
            value={formValue}
            onKeyDown={handleKeyDown}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button type="submit" className="join-item btn" disabled={!formValue}>
            <MdSend size={30} />
          </button>
        </div>
      </form>

      {exporting && <ChatPDF messages={messages} onClose={handleClosePDF} />}
    </main>
  );
};

export default ChatView;
