import { UserButton } from '@clerk/nextjs'
import { Menu, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Sidebar from './sidebar'
import { Button, Drawer, message } from 'antd'
import { useChat } from 'ai/react';
import Messages from './messages'
import axios from 'axios';
import { saveNewChat, updateChat } from '@/actions/chats'
import chatsGlobalStore from '@/store/chats-store'
import usersGlobalStore from '@/store/users-store'



function ChatInterface() {
    const [showSidebar, setShowSidebar] = React.useState(false)
    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
        keepLastMessageOnError: true,
        initialMessages: [],
    });

    const { selectedChat, setSelectedChat, setUserChats, userChats} = chatsGlobalStore() as any;
    const { loggedInUserData } = usersGlobalStore() as any;

    const addOrUpdateChat = async () => {
        try {
            if (!selectedChat) {
                const response = await saveNewChat( {
                    user: loggedInUserData._id,
                    messages: messages,
                    title: messages[0].content,
                })

                if (response.success) {
                    setSelectedChat(response.data);
                    setUserChats([response.data, ...userChats]);
                }
            } else {
                await updateChat({chatId: selectedChat._id, messages});
            }
        } catch (error: any) {
            message.error(error.message);
        }
    }
    useEffect(() => {
        if (messages.length > 0) addOrUpdateChat();
    }, [messages])

    useEffect(() => {
        if (selectedChat) {
            setMessages(selectedChat.messages);
        } else {
            setMessages([]);
        }
    }, [selectedChat]);

    // const getApiResponse = async (message: string) => {
    //     try {
    //         const response = await axios.post(
    //             'http://127.0.0.1:8000/api/chat', 
    //                 {
    //                   "user_id": "12345A",
    //                   "session_id": "5aba3397-4356-43fc-85b6-9134f66c005f",
    //                   "message": message
    //                 });
    //         const data = await response.data;
    //         console.log(data);
    //         const ans = data.response.messages[data.response.messages.length -1].message;
    //         console.log(response);
    //         //setMessages([...messages, ans]);
    //         let messages: unknown[] = []; // Notice the initialization here!
    //         messages = [...messages, ans];
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // const handleSubmitValue = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     console.log(input);
    //     const message = input.trim();
    //     console.log(message);
    //     if (message !== '') {
    //         console.log("Sending Message: " + message);
    //         getApiResponse(message);
    //     }
    // };


    return (
        <div className="bg-chatinterface h-full p-5 flex flex-col">
            <div className="flex justify-between">
                <div className="flex items-center gap-2">
                    <Menu
                        className="text-white flex lg:hidden cursor-pointer"
                        onClick={() => setShowSidebar(true)}
                    />
                    <h1 className="text-xl fond-bold text-yellow-500">
                        GenSpark
                    </h1>
                </div>
                <UserButton />
            </div>
            <div className="flex flex-col justify-between flex-1">

                <Messages messages={messages} isLoading={isLoading} />


                <form onSubmit={handleSubmit} className="relative">
                    <input
                        name="prompt"
                        value={input}
                        onChange={handleInputChange}
                        className="bg-sidebar p-5 w-full focus:outline-none focus:border-gray-500 focus:border rounded text-gray-300 text-sm"
                        placeholder='Say something'
                        required />
                    <Button htmlType = 'submit'
                    disabled={input.length === 0}
                    ghost className='absolute right-1 bottom-4 border-none'>
                        <Send className={
                            `${
                                input.length > 0 ? 'text-gray-300' : 'text-gray-700'
                            }`
                        } />
                    </Button>
                </form>

            </div>
            {showSidebar && (
                <Drawer onClose={() => setShowSidebar(false)} open={showSidebar} placement='left'>
                    <Sidebar setShowSidebar={setShowSidebar} />
                </Drawer>
            )
            }
        </div>
    )
}

export default ChatInterface