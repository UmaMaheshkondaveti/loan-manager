const Chat = require('../models/Chat');

exports.getChats = async (req, res) => {
  const chats = await Chat.find();
  res.json(chats);
};

exports.saveChat = async (req, res) => {
  const { user, messages } = req.body;

  let chat = await Chat.findOne({ user });
  if (chat) {
    chat.messages = messages;
  } else {
    chat = new Chat({ user, messages });
  }

  await chat.save();
  res.status(200).json({ success: true });
};
