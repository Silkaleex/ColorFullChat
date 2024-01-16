const express = require("express");
const LikesRouter =  express.Router();
const Like = require('../models/Likes');
const auth = require('../middelware/auth');

// Ruta para agregar un "like" a una publicación
LikesRouter.post('/publications/:publicationId/likes', auth, async (req, res) => {
  try {
    const publicationId = req.params.publicationId;
    const userId = req.user.id;

    // Verifica si el usuario ya le dio "like" a la publicación
    const existingLike = await Like.findOne({ user: userId, publication: publicationId });

    if (existingLike) {
      return res.status(400).send({ success: false, message: 'Ya diste like a esta publicación' });
    }

    // Crea una nueva instancia de "Like"
    const newLike = new Like({ user: userId, publication: publicationId });

    // Guarda el "like" en la base de datos
    await newLike.save();

    // Obtén la cantidad total de likes después de agregar el nuevo like
    const totalLikes = await Like.countDocuments({ publication: publicationId });

    return res.status(200).send({
      success: true,
      message: 'Like agregado correctamente',
      totalLikes: totalLikes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: 'Error al agregar el like',
      error: error.message,
    });
  }
});

// Ruta para obtener la lista de "likes" de una publicación con información del usuario
LikesRouter.get('/publications/:publicationId/likes', async (req, res) => {
  try {
    const publicationId = req.params.publicationId;

    // Consulta los "likes" de la publicación con información básica del usuario
    const likes = await Like.find({ publication: publicationId }).populate('user', 'name  image');

    const likesWithUserInfo = likes.map(like => ({
      user: {
        _id: like.user._id,
        name: like.user.name,
        image: like.user.image,
      },
      createdAt: like.createdAt,
    }));

    return res.status(200).json({ success: true, likes: likesWithUserInfo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});


// Ruta para quitar un "like" de una publicación
LikesRouter.delete('/publications/:publicationId/likes', auth, async (req, res) => {
  try {
    const publicationId = req.params.publicationId;
    const userId = req.user.id;

    // Busca y elimina el like existente
    await Like.findOneAndDelete({ user: userId, publication: publicationId });

    // Obtén la cantidad total de likes después de eliminar el like
    const totalLikes = await Like.countDocuments({ publication: publicationId });

    return res.status(200).send({
      success: true,
      message: 'Like eliminado correctamente',
      totalLikes: totalLikes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});


module.exports = LikesRouter;
