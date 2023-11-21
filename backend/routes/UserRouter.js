const express = require("express");
const UserRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const user = require("../models/User");
const salt = bcrypt.genSaltSync(10);
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const auth = require("../middelware/auth");
const authAdmin = require("../middelware/authAdmin");
const Follow = require("../models/Follow");
const publicacion = require("../models/Publication");

const createToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "6h" });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, "avatar" + Date.now() + file.originalname);
  },
});

const uploads = multer({ storage });

//registro de un usuario
UserRouter.post("/register", async (req, res) => {
  const { name, surname, password, email, nick, bio } = req.body; // Agrega "nick" aquí

  try {
    let userFind = await user.findOne({ email });
    if (userFind) {
      return res.status(400).send({
        success: false,
        message: "Lo sentimos algo no funcionó correctamente",
      });
    }

    if (!name || !surname || !password || !email || !nick) {
      return res.status(400).send({
        success: false,
        message: "No completaste todos los pasos",
      });
    }

    if (name.length < 3 || name.length > 15) {
      res.status(400).send({
        success: false,
        message: "Lo sentimos no completastes bien tu nick o tu nombre",
      });
    }

    let passwordHash = bcrypt.hashSync(password, salt);

    let myUser = new user({
      name,
      surname,
      email,
      password: passwordHash,
      nick,
      bio,
    });
    await myUser.save();

    const accessToken = createToken({ id: myUser._id });

    return res.status(200).send({
      success: true,
      message: "Usuario creado correctamente",
      myUser,
      accessToken,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

//Login de un usuario
UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const User = await user.findOne({ email });

    if (User.banned === true) {
      return res.status(400).send({
        success: false,
        message: `${User.name}, tu cuenta ha sido bloqueda`,
      });
    }

    if (!User) {
      return res.status(400).send({
        success: false,
        message: "Lo sentimos algo no funciono correctamente",
      });
    }

    const passwordOk = bcrypt.compareSync(password, User.password);
    if (!passwordOk) {
      return res.status(400).send({
        success: false,
        message: "Lo sentimos algo no funciono correctamente",
      });
    }

    const accessToken = createToken({ id: User._id });
    const userName = User.name;

    return res.status(200).send({
      success: true,
      message: "Login Correcto",
      User,
      userName,
      accessToken,
    });
  } catch (error) {
    return res.status(500).send({
      sucess: false,
      message: "Lo sentimos, algo no funcionó correctamente",
    });
  }
});
//modificar datos del usuario
UserRouter.put("/update", auth, async (req, res) => {
  try {
    // Recoger info del usuario a actualizar
    const userIdentity = req.user;
    const userToUpdate = req.body;

    // Eliminar campos sobrantes
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;

    // Comprobar si el usuario ya existe
    const existingUsers = await user.find({
      $or: [
        { email: userToUpdate.email.toLowerCase() },
        { nick: userToUpdate.nick.toLowerCase() },
      ],
    });

    const userIsset = existingUsers.some((user) => user._id != userIdentity.id);

    if (userIsset) {
      return res.status(200).send({
        status: "success",
        message: "El usuario ya existe",
      });
    }

    // Cifrar la contraseña si se proporciona una nueva
    if (userToUpdate.password) {
      const hashedPassword = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = hashedPassword;
    } else {
      delete userToUpdate.password;
    }

    // Buscar y actualizar el usuario
    const userUpdated = await user.findByIdAndUpdate(
      userIdentity.id,
      userToUpdate,
      { new: true }
    );

    if (!userUpdated) {
      return res
        .status(400)
        .send({ status: "error", message: "Error al actualizar" });
    }

    // Devolver respuesta
    return res.status(200).send({
      status: "success",
      message: "Perfil de usuario actualizado",
      user: userUpdated,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Lo sentimos algo no funciono bien",
    });
  }
});
//banear a un usuario
UserRouter.post("/users_ban/:id", auth, authAdmin, async (req, res) => {
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
      return res.status(400).send("El usuario está baneado");
    }
    User.banned = true;
    await User.save();
    return res.status(200).send({
      success: true,
      message: `El usuario ${User.name} ha sido baneado`,
      User,
    });
  } catch (error) {
    return res.status(500).send({
      sucess: false,
      message: error.message,
    });
  }
});
//Desbanear a un usuario
UserRouter.put("/users_desban/:id", auth, authAdmin, async (req, res) => {
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
      return res.status(400).send("El usuario está baneado");
    }
    User.banned = false;
    await User.save();
    return res.status(200).send({
      success: true,
      message: `El usuario ${User.name} ha sido desbaneado`,
      User,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
// Eliminar la cuenta como usuario
UserRouter.delete("/user", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Busca y elimina todas las publicaciones del usuario
    await publicacion.deleteMany({ user: userId });

    // Busca y elimina todas las referencias de seguimiento relacionadas con el usuario
    await Follow.deleteMany({ $or: [{ user: userId }, { followed: userId }] });

    // Elimina al usuario de la base de datos
    await user.findByIdAndDelete(userId);

    return res.status(200).send({
      success: true,
      message: "Usuario y datos asociados eliminados correctamente",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Eliminar a un usuario como administrador
UserRouter.delete("/user/:id", auth, authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await user.findByIdAndDelete(id);
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Usuario no registrado",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// usuarios verificados por el admin
UserRouter.get("/users", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Busca todos los registros de seguimiento donde el usuario autenticado es el usuario seguido
    const followers = await Follow.find({ followed: userId }).populate(
      "user",
      "name"
    );

    // Busca todos los registros de seguimiento donde el usuario autenticado es el usuario que sigue
    const following = await Follow.find({ user: userId }).populate(
      "followed",
      "name"
    );

    return res.status(200).send({
      success: true,
      message: "Lista de seguidores y usuarios seguidos obtenida correctamente",
      followers: followers.map((follower) => follower.user),
      following: following.map((follow) => follow.followed),
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Lo sentimos, algo no funcionó correctamente",
    });
  }
});
//Acceso del usuario
UserRouter.get("/users/:id", auth, async (req, res) => {
  try {
    let User = await user.findById(req.user.id);
    if (!User) {
      return res.status(400).send({
        success: false,
        message: "Usuario no encontrado",
      });
    }
    return res.status(200).send({
      success: true,
      message: "usuario encontrado correctamente",
      User,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
//Verificacion de datos de ese usuario por el admin
UserRouter.get("/user/:id", auth, authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let User = await user.findById(id);
    if (!User) {
      return res.status(400).send({
        success: false,
        message: "Usuario no encontrado",
      });
    }
    return res.status(200).send({
      success: true,
      message: "usuario encontrado correctamente",
      User,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Lista de usuarios
UserRouter.get("/list/:page?", auth, async (req, res) => {
  try {
    // Controlar en qué página estamos
    let page = 1;
    if (req.params.page) {
      page = parseInt(req.params.page);
    }

    // Consultar usuarios paginados usando Mongoose
    const itemsPerPage = 5;
    const skip = (page - 1) * itemsPerPage;

    const users = await user
      .find({}, "-password -email -role -__v")
      .sort({ _id: 1 })
      .skip(skip)
      .limit(itemsPerPage)
      .exec();

    const totalUsers = await user.countDocuments();

    // Obtén el ID del usuario autenticado desde el token de autenticación
    const userId = req.user.id;

    // Busca todos los registros de seguimiento del usuario autenticado
    const following = await Follow.find({ user: userId }).populate(
      "followed",
      "name"
    );
    const followers = await Follow.find({ followed: userId }).populate(
      "user",
      "name"
    );

    // Verificar si se encontraron usuarios
    if (!users || users.length === 0) {
      return res.status(400).send({
        status: "error",
        message: "No hay usuarios disponibles",
      });
    }

    // Devolver la lista de usuarios paginada junto con los seguidores y seguidos del usuario autenticado
    return res.status(200).send({
      status: "success",
      users,
      page,
      itemsPerPage,
      total: totalUsers,
      pages: Math.ceil(totalUsers / itemsPerPage),
      following: following.map((follow) => follow.followed),
      followers: followers.map((follow) => follow.user),
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Lo sentimos, algo no funcionó correctamente",
      error,
    });
  }
});

// Ruta para subir una imagen del usuario
UserRouter.post("/upload", uploads.single("file0"), auth, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Hubo un error al subir tu imagen",
      });
    }

    // Actualiza el campo de imagen en la base de datos
    const userUpdated = await user.findByIdAndUpdate(
      req.user.id,
      { image: req.file.filename },
      { new: true }
    );

    if (!userUpdated) {
      return res.status(404).send({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Imagen subida correctamente",
      user: userUpdated,
      file: req.file,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Algo salió mal al subir la imagen del avatar",
    });
  }
});
// Endpoint para mostrar imágenes
UserRouter.get("/upload/:file", auth, (req, res) => {
  // Sacar el parámetro de la URL
  const file = req.params.file;

  // Montar la ruta real de la imagen
  const filePath =
    "./uploads/avatars/" + file ||
    path.join(__dirname, "uploads", "avatars", file);

  // Comprobar si existe
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).send({
        success: false,
        message: "No existe la imagen",
      });
    } else {
      // Devolver el archivo
      return res.sendFile(path.resolve(filePath));
    }
  });
});

// Contadores de usuarios
UserRouter.get("/counters/:id", auth, async (req, res) => {
  const userId = req.params.id;

  // Verifica si el usuario con el ID proporcionado existe
  const userExists = await user.findById(userId);
  if (!userExists) {
    return res.status(404).send({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  try {
    const followingCount = await Follow.countDocuments({ user: userId });
    const followedCount = await Follow.countDocuments({ followed: userId });
    const publicationCount = await publicacion.countDocuments({
      user: userId, // Utiliza el userId proporcionado
    });

    return res.status(200).send({
      userId,
      following: followingCount,
      followed: followedCount,
      publications: publicationCount,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error en los contadores",
      error,
    });
  }
});

// perfil de usuario
// Ruta para obtener el perfil de un usuario
UserRouter.get("/profile/:id", auth, async (req, res) => {
  const userId = req.params.id;
  const requesterId = req.user.id;

  try {
    const userProfile = await user.findById(userId).select("-password");

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Verificar la privacidad del perfil
    if (userProfile.estadoCuenta === "privado" && userId !== requesterId) {
      return res.status(403).json({
        success: false,
        message: "Este perfil es privado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Datos del perfil obtenidos correctamente",
      userProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los datos del usuario",
      error: error.message,
    });
  }
});

// Ruta para cambiar el estado de la cuenta (público o privado)
UserRouter.put("/privacidad", auth, async (req, res) => {
  try {
    const { estadoCuenta } = req.body;
    const userId = req.user.id;

    // Verifica si el estado de la cuenta proporcionado es válido
    if (!["publico", "privado"].includes(estadoCuenta)) {
      return res.status(400).json({
        success: false,
        message: "El estado de cuenta proporcionado no es válido",
      });
    }
    
    const userToUpdate = await user.findByIdAndUpdate(
      userId,
      { estadoCuenta },
      { new: true }
    );

    if (!userToUpdate) {
      return res.status(400).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Estado de cuenta actualizado exitosamente",
      estadoCuenta: userToUpdate.estadoCuenta,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error del servidor al actualizar el estado de cuenta",
    });
  }
});


module.exports = UserRouter;
