import mongoose from 'mongoose';
import { ChatModel } from '../model/Chat';
import { Message } from '../model/Message';
import {EventEmitter} from 'events';

class SendMessage extends EventEmitter {
    execute(fn) {
        this.on('send-message', data => {
            fn(data);
        })
    };
}

const sendMessageEvent = new SendMessage();

class Chat {
    async find(users) {

            try {
                const chat = await ChatModel.find({users: users});
                return chat;
            } catch (e) {
                console.log(e);
            }
    };

    async sendMessage(data) {

            try {
                const chat = await ChatModel.find({
                    users: [data.author, data.receiver]
                });

                const message = new Message({
                       author: data.author,
                       sentAt: Date().now()
                });
                
                chat.messages.push(message);
                await chat.save();

                sendMessageEvent.emit('send-message', {
                    chatId: chat._id,
                    message: message
                })

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
