const express = require("express");
const EventosRouter = express.Router();
const Evento = require("../models/eventos");
const User = require("../models/User");
const auth = require("../middelware/auth");

// Crear un nuevo evento
EventosRouter.post("/events", auth, async (req, res) => {
  try {
    const { title, contenido, fecha } = req.body;

    const userId = req.user.id; // Utiliza directamente req.user.id para obtener el ID del usuario autentificado

    if (!title || !contenido || !fecha || title.length < 3) {
      return res.status(400).send({
        success: false,
        message: "No completaste todos los pasos",
      });
    }
    if(fecha < 8){
      return res.status(400).send({
        success:false,
        message:"no completastes todos los pasos"
      })
    }
    const newEvento = new Evento({
      title,
      contenido,
      fecha,
      user: userId,
    });

    await newEvento.save();

    // Agrega el ID del nuevo evento al array de eventos del usuario
    await User.findByIdAndUpdate(userId, {
      $push: {
        eventos: newEvento._id,
      },
    });

    return res.status(200).send({
      success: true,
      message: "Tus datos se guardaron correctamente",
      newEvento
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

EventosRouter.get("/events/:id",auth,async(req,res)=>{
  try{
    const {id} = req.params;
    let evento = await Evento.findById(id).populate({
      path:"user",
      select:"name"
    })
    if (!evento) {
      return res.status(400).send({
        success: false,
        message: "Eventos no encontrados",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Tus eventos fueron Encontrados correctamente",
      evento,
    });
  }catch(error){
    return res.status(500).send({
      success:false,
      message:error.message
    })
  }
})

module.exports = EventosRouter;
