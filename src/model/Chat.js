import { Schema, model } from 'mongoose';

import { Message } from './Message.js';

export const Chat = new Schema({
    users: { type: [ObjectId, ObjectId], required: true },
    createdAt: { type: Date, required: true },
    messages: [Message],
});

export const ChatModel = model('Chat', Chat);
