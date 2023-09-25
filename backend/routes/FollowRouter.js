const express = require("express");
const followRouter = express.Router();
const auth = require("../middelware/auth");
const Follow = require("../models/Follow");
const user = require("../models/User");

// Ruta para guardar un seguimiento
followRouter.post("/follow", auth, async (req, res) => {
  try {
    // Obtén el ID del usuario que realiza el seguimiento desde el token de autenticación
    const followerUserId = req.user.id;

    // Obtén el ID del usuario a seguir desde el cuerpo de la solicitud
    const followedUserId = req.body.followedUserId;

    // Comprueba si la relación de seguimiento ya existe en la base de datos
    const existingFollow = await Follow.findOne({
      follower: followerUserId,
      followed: followedUserId,
      action: "follow",
    });

    if (existingFollow) {
      return res
        .status(400)
        .send({ success: false, message: "Ya sigues a este usuario." });
    }

    // Obtiene el nombre del usuario que realiza el seguimiento
    const followerUser = await user.findById(followerUserId);
    const followerUserName = followerUser.name;

    // Crea un nuevo objeto Follow y asigna el nombre del usuario que sigue
    const newFollow = new Follow({
      follower: followerUserId,
      followed: followedUserId,
      user_name: followerUserName,
    });

    await newFollow.save();

    return res.status(200).send({
      success: true,
      message: "Seguimiento exitoso.",
      newFollow,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Algo no salió bien",
    });
  }
});

// Ruta para seguir a un usuario por su ID
followRouter.post("/follow/:userId", auth, async (req, res) => {
  const { userId } = req.params;

  try {
    // Verificar si el usuario al que se quiere seguir existe
    const userToFollow = await user.findById(userId);

    if (!userToFollow) {
      return res.status(404).send({
        success: false,
        message: "El usuario que intentas seguir no existe",
      });
    }

    // Verificar si el usuario ya está siguiendo a este usuario
    const existingFollow = await Follow.findOne({
      action: "follow", // Acción de seguir
      followed: userId,
      user: req.user.id, // El usuario que está realizando la acción de seguir
    });

    if (existingFollow) {
      return res.status(400).send({
        success: false,
        message: "Ya estás siguiendo a este usuario",
      });
    }

    // Crear un nuevo seguimiento en la base de datos con la acción "follow"
    const newFollow = new Follow({
      action: "follow", // Acción de seguir
      followed: userId,
      user: req.user.id,
    });

    await newFollow.save();

    // Obtener el nombre del usuario seguido
    const userToFollowName = userToFollow.name;

    return res.status(200).send({
      success: true,
      message: `Has seguido a ${userToFollowName} correctamente`,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Lo sentimos, algo no funcionó correctamente",
    });
  }
});

// Ruta para dejar de seguir a un usuario por su ID
followRouter.delete("/unfollow/:id", auth, async (req, res) => {
  try {
    // Recoger el id del usuario identificado
    const userId = req.user.id;

    // Recoger el id del usuario que se quiere dejar de seguir
    const followedId = req.params.id;

    // Buscar el seguimiento existente y eliminarlo
    const followDeleted = await Follow.findOneAndRemove({
      user: userId,
      followed: followedId,
    });

    if (!followDeleted) {
      return res.status(500).send({
        status: "error",
        message: "No has dejado de seguir a nadie",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Dejaste de seguir al usuario correctamente",
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al dejar de seguir al usuario",
    });
  }
});

// Ruta para bloquear a un usuario por su ID
followRouter.post("/block/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const User = await user.findById(id);

    if (!User) {
      return res.status(404).send({
        success: false,
        message: "Usuario no encontrado",
      });
    }
    if (User.banned === true) {
      return res.status(400).send("El usuario está bloqueado");
    }
    User.banned = true;
    await User.save();
    return res.status(200).send({
      success: true,
      message: `El usuario ${User.name} ha sido bloqueado`,
      User,
    });
  } catch (error) {
    return res.status(500).send({
      sucess: false,
      message: error.message,
    });
  }
});
// Ruta para desbloquear a un usuario por su ID
followRouter.post("/desBlock/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const User = await user.findById(id);

    if (!User) {
      return res.status(404).send({
        success: false,
        message: "Usuario no encontrado",
      });
    }
    if (User.banned === false) {
      return res.status(400).send("El usuario está Desbloqueado");
    }
    User.banned = false;
    await User.save();
    return res.status(200).send({
      success: true,
      message: `El usuario ${User.name} ha sido Desbloqueado`,
      User,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Ruta para obtener la lista de SEGUIDOS del usuario autentificado
followRouter.get("/following", auth, async (req, res) => {
  try {
    // Obtén el ID del usuario autenticado desde el token de autenticación
    const userId = req.user.id;

    // Busca todos los registros de seguimiento donde el usuario autenticado es el usuario que sigue
    const following = await Follow.find({ user: userId }).populate("followed");

    // Extrae la información relevante de los usuarios a los que sigues
    const followingUsers = following.map((follow) => follow.followed.name);

    return res.status(200).send({
      success: true,
      message: "Lista de usuarios a los que sigues obtenida correctamente",
      following: followingUsers,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Lo sentimos, algo no funcionó correctamente",
    });
  }
});

// Ruta para obtener la lista de SEGUIDORES del usuario autentficado
followRouter.get("/followers", auth, async (req, res) => {
  try {
    // Obtén el ID del usuario autenticado desde el token de autenticación
    const userId = req.user.id;

    // Busca todos los registros de seguimiento donde el usuario autenticado es el "followed"
    const followers = await Follow.find({ followed: userId }).populate("user");

    // Extrae la información relevante de los seguidores (por ejemplo, sus nombres)
    const followersNames = followers.map((follower) => follower.user.name);

    return res.status(200).send({
      success: true,
      message: "Lista de seguidores obtenida correctamente",
      followers: followersNames,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Lo sentimos, algo no funcionó correctamente",
    });
  }
});
// Ruta para obtener la lista de SEGUIDOS del usuario autenticado con paginación y posibilidad de proporcionar el ID del usuario
followRouter.get("/following/:id?/:page?", auth, async (req, res) => {
  try {
    let userId = req.user.id;

    if (req.params.id) {
      userId = req.params.id;
    }

    let page = 1;
    if (req.params.page) {
      page = parseInt(req.params.page);
    }

    const itemsPerPage = 5;

    const follows = await Follow.find({ user: userId })
      .populate("followed")
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);
    const following = await Follow.find({ user: userId }).populate(
      "followed",
      "name"
    );
    const followers = await Follow.find({ followed: userId }).populate(
      "user",
      "name"
    );
    const total = await Follow.countDocuments({ user: userId });

    const totalPages = Math.ceil(total / itemsPerPage);

    return res.status(200).json({
      status: "success",
      message: "Listado de usuarios que estás siguiendo",
      follows,
      following,
      followers,
      total,
      pages: totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message:
        "Ha ocurrido un error al obtener los usuarios que estás siguiendo.",
    });
  }
});

// Ruta para obtener la lista de SEGUIDORES del usuario autenticado con paginación y posibilidad de proporcionar el ID del usuario
followRouter.get("/followers/:id?/:page?", auth, async (req, res) => {
  try {
    let userId = req.user.id;

    if (req.params.id) {
      userId = req.params.id;
    }

    let page = 1;
    if (req.params.page) {
      page = parseInt(req.params.page);
    }

    const itemsPerPage = 5;

    const follows = await Follow.find({ followed: userId })
      .populate("user")
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);
    const following = await Follow.find({ user: userId }).populate(
      "followed",
      "name"
    );
    const followers = await Follow.find({ followed: userId }).populate(
      "user",
      "name"
    );
    const total = await Follow.countDocuments({ followed: userId });

    const totalPages = Math.ceil(total / itemsPerPage);

    return res.status(200).json({
      status: "success",
      message: "Listado de usuarios que te siguen",
      follows,
      followers,
      following,
      total,
      pages: totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Ha ocurrido un error al obtener los seguidores.",
    });
  }
});

module.exports = followRouter;
