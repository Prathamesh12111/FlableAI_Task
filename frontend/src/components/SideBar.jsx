import { useState, useEffect, useContext } from 'react';
import {
  MdClose,
  MdMenu,
  MdDelete,
  MdNewLabel,
} from 'react-icons/md';
import { ChatContext } from '../context/chatContext';
import logo from '../assets/logo.png';
import ToggleTheme from './ToggleTheme';
// import axios from 'axios';

const SideBar = () => {
  const [open, setOpen] = useState(true);
  const [, , clearChat] = useContext(ChatContext);
  const [newChatCounter, setNewChatCounter] = useState(0);
  const [, addMessage] = useContext(ChatContext);

  function handleResize() {
    window.innerWidth <= 720 ? setOpen(false) : setOpen(true);
  }

  useEffect(() => {
    handleResize();
  }, []);

  function clear() {
    clearChat();
  }

  function handleNewChat() {
    setNewChatCounter(prevCounter => prevCounter + 1);
    addMessage({
      id: newChatCounter,
      createdAt: Date.now(),
      text: 'New chat started.',
      ai: false,
      selected: '',
    });
  }

  return (
    <div className='flex'>
    <section
      className={`${
        open ? 'w-72' : 'w-16'
      } bg-neutral flex flex-col items-center gap-y-4 h-screen pt-4 relative duration-100 shadow-md`}>
      <div className='flex items-center justify-between w-full px-2 mx-auto'>
        <div
          className={` ${
            !open && 'scale-0 hidden'
          } flex flex-row items-center gap-2 mx-auto w-full`}>
          <img src={logo} alt='logo' className='w-44 h-10 pl-3' />
        </div>
        <div
          className='mx-auto btn btn-square btn-ghost'
          onClick={() => setOpen(!open)}>
          {open ? <MdClose size={15} /> : <MdMenu size={15} />}
        </div>
      </div>

      <ul className='w-full menu rounded-box'>
        <li>
          <a onClick={clear}>
            <MdDelete size={15} />
            <p className={`${!open && 'hidden'}`}>Clear chat</p>
          </a>
        </li>
        <br></br>
        <li>
            <button
              className={`${open ? '' : 'hidden'}`}
              onClick={handleNewChat}>
              <MdNewLabel size={15} />
             <p className={`${!open && 'hidden'}`}>New chat</p>
            </button>
          </li>
      </ul>

      <ul className='absolute bottom-0 w-full gap-1 menu rounded-box'>
        <li>
          <ToggleTheme open={open} />
        </li>
        <li>
            <p className={`${!open && 'hidden'}`}>MARCO</p>
        </li>
        <li>
            <p className={`${!open && 'hidden'}`}>Social Watch</p>
        </li>
        <li>
            <p className={`${!open && 'hidden'}`}>Web Analytics</p>
        </li>
      </ul>
    </section>
    </div>
  );
};

export default SideBar;
