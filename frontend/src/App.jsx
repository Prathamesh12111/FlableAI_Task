import { ChatContextProvider } from "./context/chatContext";
import SideBar from "./components/SideBar";
import ChatView from "./components/ChatView";
import ChatHistory from "./components/ChatHistory";

const App = () => {
  return (
    <ChatContextProvider>
      <div className="flex transition duration-500 ease-in-out">
        <SideBar />
        <ChatHistory/>
        <ChatView />
      </div>
    </ChatContextProvider>
  );
};

export default App;
