import { ChatModel } from '../model/Chat.js';
import { Message } from '../model/Message.js';
import { EventEmitter } from 'events';

class SendMessage extends EventEmitter {
    execute(fn) {
        this.on('send-message', (data) => {
            fn(data);
        });
    }
}

const sendMessageEvent = new SendMessage();

export class Chat {
    async find(users) {
        try {
            const chat = await ChatModel.find({ users: users });
            return chat;
        } catch (e) {
            console.log(e);
        }
    }

    async findById(id) {
        return await ChatModel.findById(id);
    }

    async sendMessage(data) {
        try {
            const chat = await ChatModel.find({
                users: {$or: [
                    { users: [data.idAuthor, data.idReceiver] },
                    { users: [data.idReceiver, data.idAuthor] },
                ]},
            });

            if (!chat) {
                const newChat = new ChatModel({
                    users: [data.idAuthor, data.idReceiver],
                    createdAt: Date.now()
                });

                await newChat.save();
            }

            const message = new Message({
                author: data.author,
                sentAt: Date().now(),
                text: data.text
            });

            chat.messages.push(message);
            await chat.save();

            sendMessageEvent.emit('send-message', {
                chatId: chat._id,
                message: message,
            });

            return message;
        } catch (e) {
            console.log(e);
        }
    }

    subscribe(cb) {
        sendMessageEvent.execute(cb);
    }

    async getHistory(id) {
        try {
            const chat = ChatModel.findById(id);

            return chat.messages;
        } catch (e) {
            console.log(e);
        }
    }
}
