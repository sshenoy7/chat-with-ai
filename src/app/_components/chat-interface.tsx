import { UserButton } from '@clerk/nextjs'
import { CirclePlus, Menu, Send } from 'lucide-react'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import Sidebar from './sidebar'
import { Button, Drawer, message, Upload } from 'antd'
import { Message, useChat } from 'ai/react';
import Messages from './messages'
import { saveNewChat, updateChat } from '@/actions/chats'
import chatsGlobalStore from '@/store/chats-store'
import usersGlobalStore from '@/store/users-store'
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

function ChatInterface() {
    const [showSidebar, setShowSidebar] = React.useState(false)
    const { messages, input, isLoading, handleInputChange, setMessages, setInput } = useChat({
        keepLastMessageOnError: true,
        initialMessages: [],
    });

    const { selectedChat, setSelectedChat, setUserChats, userChats } = chatsGlobalStore() as any;
    const { loggedInUserData } = usersGlobalStore() as any;

    const props: UploadProps = {
        name: 'file',
        action: 'http://localhost:8000/uploadfile',
        headers: {
            authorization: 'authorization-text',
        },
        showUploadList: false,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };


    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        console.log("Inside...");
        event.preventDefault();
        setInput('');
        const prompt = input;

        try {
            const userMessage: Message = {
                id: loggedInUserData._id,
                content: prompt,
                role: 'user', // Assuming user ID is included
            };
            setMessages((prevMessages: Message[]) => [...prevMessages, userMessage]);
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        "user_id": "12345A",
                        "session_id": "5aba3397-4356-43fc-85b6-9134f66c005f",
                        "message": prompt

                    }
                ),
            });

            const data = await response.json();
            const ans = data.response.messages[data.response.messages.length - 1].message;
            const newMessage: Message = {
                // Assuming Message object has id, user etc properties
                id: loggedInUserData._id,
                content: data.response.messages[data.response.messages.length - 1].message,
                role: 'assistant', // Assuming user ID is included
                // Add other properties as required
            };

            setMessages((prevMessages: Message[]) => [...prevMessages, newMessage]);
            console.log(data);
            return {
                input: ''
            };
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(messages);
        }
    }

    const addOrUpdateChat = async () => {
        try {
            if (!selectedChat) {
                const response = await saveNewChat({
                    user: loggedInUserData._id,
                    messages: messages,
                    title: messages[0].content,
                })

                if (response.success) {
                    setSelectedChat(response.data);
                    setUserChats([response.data, ...userChats]);
                }
            } else {
                await updateChat({ chatId: selectedChat._id, messages });
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
                        className="bg-sidebar p-5 w-full focus:outline-none focus:border-gray-500 focus:border rounded text-gray-300 text-sm ml-5"
                        placeholder='Say something'
                        required />

                    <Upload {...props} className='absolute left-1 bottom-4 border-none'>
                        <Button size='middle' icon={<UploadOutlined />} className='text-gray-700'></Button>
                    </Upload>
                    <Button htmlType='submit'
                        disabled={input.length === 0}
                        ghost className='absolute right-1 bottom-4 border-none'>
                        <Send className={
                            `${input.length > 0 ? 'text-gray-300' : 'text-gray-700'
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