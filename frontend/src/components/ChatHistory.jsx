import { useEffect, useState } from "react";
import axios from "axios";

function ChatHistory() {
  const [chatHistory, setChatHistory] = useState([]);
  const maxEntriesToShow = 5;

  useEffect(() => {
    // Fetch chat history data from backend
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/getChatHistory"
        );
        setChatHistory(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchChatHistory();
  }, []);

  const handleClearHistory = async () => {
    try {
      await axios.post("http://localhost:5000/clearChatHistory");
      setChatHistory([]);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  return (
    <section className="bg-neutral w-72">
      <div className="chathistory-container">
        <ul className="menu">
          {chatHistory.slice(0, maxEntriesToShow).map((entry, index) => (
            <li key={index}>
              <p>Prompt: {entry.prompt}</p>
              <p>Response: {entry.response}</p>
            </li>
          ))}
        </ul>
        {chatHistory.length > maxEntriesToShow && (
          <p className="read-more-btn">...</p>
        )}
        <button onClick={handleClearHistory} className="clear-history-btn pl-2">
          <p>Clear history</p>
        </button>
      </div>
    </section>
  );
}

export default ChatHistory;
