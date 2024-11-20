

import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"

export const sendMessage = async (req, res) => {
    try {
        const message = req.body.message
        console.log(message)
        const receiverId = req.params.id
        const senderId = req.user._id
        // const senderName = req.user.fullName 

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })
        
        await newMessage.save()
        
        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }
        await conversation.save()

        return res.status(201).json({
            success: true,
            msg: 'message set successfully.',
            newMessage,
        });
    } catch (error) {
        console.error("This error is from message.controller.js sendMessage function:", error);

        return res.status(500).json({
            success: false,
            msg: 'Something went wrong. Please try again later.',
            error: error.message
        });
    }
}

export const gesMessages = async (req, res) => {
    try {
        const userToChatId = req.params.id
        const senderId = req.user._id

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate({
            path: 'messages',
            model: 'Message',
        });
    
        if (!conversation) {
            return res.status(404).json({
                success: false,
                msg: 'Conversation not found',
            });
        }
        return res.status(200).json({
            success: true,
            msg: 'All messages get successfully',
            messages: conversation.messages
        });
    } catch (error) {
        console.error("This error is from message.controller.js getMessage function:", error);

        return res.status(500).json({
            success: false,
            msg: 'Something went wrong. Please try again later.',
            error: error.message
        });
    }
}


