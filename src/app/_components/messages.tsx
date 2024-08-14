import usersGlobalStore from '@/store/users-store'
import { Button, message, Spin } from 'antd'
import { Bot, Check, Copy, Share } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import ShareMessage from './share-message'

function Messages({ messages, isLoading }: { messages: any[], isLoading: boolean }) {
    const { loggedInUserData } = usersGlobalStore() as any;
    const messagesRef = React.useRef<any>(null);
    const [copiedMessage, setCopiedMessage] = useState<string>("");
    const [messageToShare, setMessageToShare] = useState<string>("");
    const [openShareModal, setOpenShareModal] = useState<boolean>(false);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages]);

    const onCopy = (content: string) => {
        try {
            navigator.clipboard.writeText(content);
            setCopiedMessage(content);
            message.success("Message copied to clipboard!");
        } catch (error: any) {
            message.error("Failed to copy content");
        }
    }

    if (!isLoading && messages.length === 0) {
        return (
            <div className="h-[75vh] flex items-center justify-center">
                <div className="flex flex-col text-gray-400 text-sm font-bold">
                    <span>
                        Heyy, {loggedInUserData.name}
                    </span>
                    <span>
                        How can I help you today?
                    </span>
                </div>
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-7 text-gray-300 mt-7 text-sm h-[75vh] overflow-auto">
            {
                messages.map((message) => {
                    if (message.role === "user") {
                        return (
                            <div className="flex justify-end mr-5">
                                <span className="bg-gray-800 p-3 rounded">
                                    {message.content}
                                </span>
                            </div>
                        )
                    } else {
                        return (
                            <div className="flex gap-2">
                                <div className="border border-gray-300 border-solid rounded-full h-6 w-6 flex items-center justify-center">
                                    <Bot size={16} />
                                </div>
                                <div className="flex-1 flex flex-col gap-5">
                                    <Markdown>{message.content}</Markdown>

                                    <div className="flex -ml-4">
                                        <Button ghost className='border-none'>
                                            {copiedMessage === message.content ? 
                                            <Check size={16} className='text-gray-500'/> : <Copy size={16} className='text-gray-500' onClick={() => copiedMessage !== message.content && onCopy(message.content)} />}
                                        </Button>
                                        <Button ghost className='border-none'
                                            onClick={() => {
                                                setMessageToShare(message.content);
                                                setOpenShareModal(true);
                                            }
                                            }>
                                            <Share size={16} className='text-gray-500'/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })
            }

            <div className="flex justify-start">
                {isLoading && <Spin size='small' />}
            </div>

            {openShareModal && 
            <ShareMessage 
            open={openShareModal} 
            setOpen={setOpenShareModal} 
            messageToShare={messageToShare}/>}
        </div>
    );
}

export default Messages