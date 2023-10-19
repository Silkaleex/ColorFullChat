const express = require("express");
const ChatRouter = express.Router();
const Chat = require("../models/Chat");
const auth = require("../middelware/auth")

// Ruta para crear una nueva conversación
ChatRouter.post("/chats",auth, async (req, res) => {
  try {
    const { participants } = req.body;
    const chat = new Chat({ participants });
    
    if (!participants) {
        return res.status(400).send({
          success: false,
          message: "No hay mensajes que mostrar",
        });
      }
    const savedChat = await chat.save();
    
    return res.status(200).send({
        success: true,
        message: "Mostrando Chats  correctamente",
        savedChat
    });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Ocurrió un error en el servidor",
        error: error.message
    });
  }
});

// Ruta para obtener todas las conversaciones de un usuario
ChatRouter.get("/chats/:userId",auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const chats = await Chat.find({ participants: userId }).populate(
      "participants",
      "username"
    ); // muestra el nombre del chat y los participantes
    return res.status(200).send({
        success: true,
        message: "Mostrando Chats  correctamente",
        chats
    });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Ocurrió un error en el servidor",
        error: error.message
    });
  }
});

// Ruta para agregar un mensaje a una conversación
ChatRouter.post("/chats/:chatId/messages",auth, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const { sender, text } = req.body;
    const message = { sender, text };
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: message } },
      { new: true }
    );
    return res.status(200).send({
        success: true,
        message: "Mostrando Chats correctamente",
        updatedChat
    });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Ocurrió un error en el servidor",
        error: error.message
    });
  }
});

module.exports = ChatRouter;
