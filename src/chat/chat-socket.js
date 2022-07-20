import { Chat } from '../module/ChatModule.js';

export const initChat = function (io) {
  io.on('connection', (socket) => {
    const { id } = socket;
    console.log(`Socket connected: ${id}`);

    const { idAuthor } = socket.handshake.query;
    console.log(`Socket chat: ${idAuthor}`);
    socket.join(idAuthor);

    socket.on('get-history', async (msg) => {
      let chatHistory;
      const connectChat = await Chat.find({
        $or: [
          { users: [msg.idReceiver, idAuthor] },
          { users: [idAuthor, msg.idReceiver] },
        ],
      });
      if (!connectChat) {
        chatHistory = {
          data: 'Такого чата не существует',
          status: 'error',
        };
      } else {
        chatHistory = await Chat.getHistory(connectChat._id);
      }

      socket.to(idAuthor).emit('chat-history', chatHistory);
      socket.emit('chat-history', chatHistory);
    });

    socket.on('send-message', async (msg) => {
      msg.idAuthor = idAuthor;

      Chat.sendMessage(msg);

      msg.type = `id: ${idAuthor}`;

      socket.to(idAuthor).emit('new-message', msg);
      socket.emit('new-message', msg);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${id}`);
    });
  });
};
