const express = require("express");
const PeticionRouter = express.Router();
const auth = require("../middelware/auth");
const User = require("../models/User");
const Peticion = require("../models/peticion");

PeticionRouter.post("/peticion/:receiverId", auth, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user.id;

    // Verificar si el usuario receptor existe
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Usuario receptor no encontrado",
      });
    }

    // Verificar si ya hay una solicitud pendiente entre estos dos usuarios
    const existingRequest = await Peticion.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Ya hay una solicitud pendiente entre estos dos usuarios",
      });
    }

    // Crear una nueva solicitud de amistad
    const friendRequest = new Peticion({
      sender: senderId,
      receiver: receiverId,
    });

    await friendRequest.save();

    return res.status(200).json({
      success: true,
      message: "Solicitud de amistad enviada correctamente",
      friendRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al enviar la solicitud de amistad",
      error: error.message,
    });
  }
});

PeticionRouter.get("/peticion", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const receivedRequests = await Peticion.find({
      receiver: userId,
      status: "pending",
    }).populate("sender", "name");

    return res.status(200).json({
      success: true,
      message: "Solicitudes de amistad pendientes obtenidas correctamente",
      friendRequests: receivedRequests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener las solicitudes de amistad pendientes",
      error: error.message,
    });
  }
});

PeticionRouter.put("/peticion/:requestId/:action", auth, async (req, res) => {
  try {
    const { requestId, action } = req.params;
    const userId = req.user.id;

    // Verificar si la solicitud de amistad existe y pertenece al usuario autenticado
    const friendRequest = await Peticion.findOne({
      _id: requestId,
      receiver: userId,
      status: "pending",
    });

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Solicitud de amistad no encontrada o ya procesada",
      });
    }

    // Actualizar el estado de la solicitud de amistad
    if (action === "accept") {
      friendRequest.status = "accepted";
      // Agregar al usuario remitente a la lista de amigos del usuario receptor
      await User.findByIdAndUpdate(userId, { $push: { friends: friendRequest.sender } });
      // Agregar al usuario receptor a la lista de amigos del usuario remitente
      await User.findByIdAndUpdate(friendRequest.sender, { $push: { friends: userId } });
    } else if (action === "reject") {
      friendRequest.status = "rejected";
    } else {
      return res.status(400).json({
        success: false,
        message: "Acción no válida. Use 'accept' o 'reject'",
      });
    }

    await friendRequest.save();

    return res.status(200).json({
      success: true,
      message: `Solicitud de amistad ${action}ada correctamente`,
      friendRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al procesar la solicitud de amistad",
      error: error.message,
    });
  }
});

module.exports = PeticionRouter;
