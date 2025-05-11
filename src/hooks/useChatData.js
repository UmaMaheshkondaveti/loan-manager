import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/api/chat';

function useChatData(initialUser) {
  const [chatData, setChatData] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(API_URL);
        const userChat = response.data.find(chat => chat.user === initialUser);
        setChatData(userChat ? userChat.messages : []);
      } catch (error) {
        console.error("Failed to load chat data", error);
      }
    };

    fetchChats();
  }, [initialUser]);

  const saveChat = async (messages) => {
    try {
      await axios.post(API_URL, {
        user: initialUser,
        messages
      });
      setChatData(messages);
    } catch (error) {
      console.error("Failed to save chat data", error);
    }
  };

  return [chatData, saveChat];
}

export default useChatData;
