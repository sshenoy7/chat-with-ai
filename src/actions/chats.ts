"use server"

import ChatModel from "@/models/chat-model"

export const saveNewChat = async (payload: any) => {
    try {
        const response = await ChatModel.create(payload);
        return {
            data: JSON.parse(JSON.stringify(response)),
            success: true
        };
    } catch (error:any) {
        return {
            message: error.message,
            success: false
        }
    }
}

export const getChatsByUserId = async (userId: string) => {
    try {
        const response = await ChatModel.find({ user: userId });
        return {
            data: JSON.parse(JSON.stringify(response)),
            success: true
        };
    } catch (error:any) {
        return {
            message: error.message,
            success: false
        }
    }
}

export const updateChat = async ({
    chatId = "",
    messages = []
}: {
    chatId: String,
    messages: any[]
}) => {
    try {
        const response = await ChatModel.findByIdAndUpdate(
            chatId,
            { messages },
            { new: true}
        );
        if (!response) {
            throw new Error(`Chat not found with id: ${chatId}`);
        }
        
        return {
            data: JSON.parse(JSON.stringify(response)),
            success: true
        };
    } catch (error:any) {
        return {
            message: error.message,
            success: false
        }
    }
}


export const deleteChat = async (chatId: string) => {
    try {
        const response = await ChatModel.findByIdAndDelete(chatId);
        if (!response) {
            throw new Error(`Chat not found with id: ${chatId}`);
        }
        
        return {
            data: JSON.parse(JSON.stringify(response)),
            success: true
        };
    } catch (error:any) {
        return {
            message: error.message,
            success: false
        }
    }
}
