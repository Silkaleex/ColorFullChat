const express = require("express");
const publicationRouter = express.Router();
const publicacion = require("../models/Publication");
const auth = require("../middelware/auth");
const user = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/publications");
  },
  filename: (req, file, cb) => {
    cb(null, "pub-" + Date.now() + "-" + file.originalname);
  },
});
const uploads = multer({ storage });


// Manteniendo el nombre de la ruta "/save"
publicationRouter.post("/save", uploads.single("file0"), auth, async (req, res) => {
  try {
    const { text } = req.body;
    const imagePath = req.file ? req.file.path : null;

    // Comprueba si se proporcionó texto o imagen
    if (!text && !imagePath) {
      return res.status(400).send({
        success: false,
        message: "No completaste todos los pasos",
      });
    }

    // Crea una nueva instancia de la publicación con texto e imagen
    const nuevaPublicacion = new publicacion({
      text,
      file: imagePath,
      user: req.user.id,
      createdAt: new Date(),
    });

    // Guarda la publicación en la base de datos
    await nuevaPublicacion.save();

    return res.status(200).send({
      success: true,
      message: "Publicación creada con éxito",
      nuevaPublicacion,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Ruta para crear una publicación de texto con imagen
publicationRouter.post("/create", uploads.single("file0"), auth, async (req, res) => {
  try {
    const { text } = req.body;
    const imagePath = req.file ? req.file.path : null;

    const nuevaPublicacion = new publicacion({
      text,
      file: imagePath,
      user: req.user.id,
      createdAt: new Date(),
    });

    if (!text && !imagePath) {
      return res.status(400).send({
        success: false,
        message: "No completaste todos los pasos",
      });
    }

    await nuevaPublicacion.save();

    return res.status(200).send({
      success: true,
      message: "Publicación creada con éxito",
      nuevaPublicacion,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Mostrar todas las publicaciones del usuario autenticado
publicationRouter.get("/details", auth, async (req, res) => {
  try {
    // Consulta todas las publicaciones del usuario autenticado en la base de datos
    const publicaciones = await publicacion.find({ user: req.user.id });

    if (!publicaciones) {
      return res.status(400).send({
        success: false,
        message: "No hay publicaciones que mostrar",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Aquí están todas tus publicaciones",
      publicaciones,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      mensaje: error.message,
    });
  }
});

// Mostrar una publicación específica del usuario autenticado
publicationRouter.get("/details/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    // Consulta la publicación específica del usuario autenticado en la base de datos
    const publicacion = await publicacion.findOne({ _id: id, user: req.user.id });

    if (!publicacion) {
      return res.status(400).send({
        success: false,
        message: "No hay publicación que mostrar",
      });
    }

    // Construye la URL de la imagen basada en el nombre del archivo almacenado en "file"
    const imageFileName = publicacion.file; // Nombre del archivo de la imagen
    const imageUrl = `/uploads/${imageFileName}`; // Ruta relativa para acceder a la imagen

    // Agrega la URL de la imagen a la respuesta
    const response = {
      success: true,
      message: "Aquí está tu publicacion",
      publicacion: {
        _id: publicacion._id,
        user: publicacion.user,
        text: publicacion.text,
        file: imageUrl, // Agrega la URL de la imagen a la respuesta
      },
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({
      success: false,
      mensaje: error.message,
    });
  }
});


//Crear una publicacion de un usuario con imagen
publicationRouter.post(
  "/upload/:id",
  uploads.single("file0"),
  auth,
  async (req, res) => {
    try {
      const { text } = req.body;

      // Verifica si se subió una imagen y guarda la ruta de la imagen en el campo "file" de la publicación
      const imagePath = req.file ? req.file.path : null;

      // Crea una nueva instancia de la publicación con texto e imagen
      const nuevaPublicacion = new publicacion({
        text,
        file: imagePath, // Almacena la ruta de la imagen en el campo "file"
      });

      // Verifica si se proporcionó texto o imagen
      if (!text && !imagePath) {
        return res.status(400).send({
          success: false,
          message: "No completaste todos los pasos",
        });
      }

      // Guarda la publicación en la base de datos
      await nuevaPublicacion.save();

      return res.status(200).send({
        success: true,
        message: "Agregando tu publicación con texto e imagen",
        nuevaPublicacion,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
);
publicationRouter.put("/modPublication/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    await publicacion.findByIdAndUpdate(id, { text });

    if (!text) {
      return res.status(400).send({
        succcess: false,
        message: "No completastes todos los campos",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Publicacion modificado",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
publicationRouter.delete("/publication/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await publicacion.findByIdAndDelete(id);
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "No se a encontrado la publicación que buscabas",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Tu Publicación ha sido eliminada",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Ruta para subir una imagen del usuario
publicationRouter.post(
  "/uploads",
  uploads.single("file0"),
  auth,
  (req, res) => {
    // Recoger el fichero y verificar que existe
    if (!req.file) {
      return res.status(400).send({
        status: false,
        message: "Hubo un error al subir tu imagen",
      });
    }

    // Guardar la ruta de la imagen en el campo "file" de la publicación
    const imagePath = req.file.path;

    // Respuesta
    try {
      return res.status(200).send({
        success: true,
        message: "Imagen subida correctamente",
        user: req.user,
        file: imagePath, // Almacena la ruta de la imagen en el campo "file"
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Algo no funcionó correctamente",
      });
    }
  }
);

// Endpoint para mostrar imágenes
publicationRouter.get("/uploads/:file", auth, (req, res) => {
  // Sacar el parámetro de la URL
  const file = req.params.file;

  // Montar la ruta real de la imagen en la carpeta de avatares
  const filePath =
    "./uploads/publications/" + file ||
    path.join(__dirname, "uploads", "publications", file);

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
// Feed de publicaciones
publicationRouter.get("/feed/:page?", auth, async (req, res) => {
  try {
    const page = req.params.page || 1;
    const limit = 5; // Número de publicaciones por página
    const skip = (page - 1) * limit;

    // Consulta todas las publicaciones con información del usuario que las hizo
    const publications = await publicacion
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    if (!publications || publications.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No hay publicaciones disponibles.",
      });
    }

    // Recopila los IDs de los usuarios que hicieron las publicaciones
    const userIds = publications.map((publication) => publication.user);

    // Consulta la información de los usuarios que hicieron las publicaciones
    const users = await user.find({ _id: { $in: userIds } }, 'name image');

    // Mapea la información de los usuarios a cada publicación
    const publicacionesConUsuarios = publications.map((publication) => {
      const user = users.find((u) => u._id.equals(publication.user));
      return {
        _id: publication._id,
        user: user,
        text: publication.text,
        createdAt: publication.createdAt,
        // Agrega cualquier otro campo que necesites
      };
    });

    // Devolver las publicaciones con información del usuario en formato JSON
    return res.status(200).json({
      success: true,
      message: "Listado de todas las publicaciones con información del usuario",
      publicaciones: publicacionesConUsuarios,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Listado de publicaciones por ID de usuario y paginación opcional
publicationRouter.get("/list/:userId/:page?", auth, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Consulta todas las publicaciones del usuario específico en la base de datos
    const publicaciones = await publicacion.find({ user: userId });

    if (!publicaciones || publicaciones.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No hay publicaciones disponibles para este usuario.",
      });
    }

    // Devolver las publicaciones en formato JSON
    return res.status(200).json({
      success: true,
      message: "Listado de publicaciones del usuario",
      publicaciones,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// Ruta para devolver archivos multimedia (imágenes)
publicationRouter.get("/media/:file", auth, (req, res) => {
  // Sacar el parámetro de la URL
  const file = req.params.file;

  // Montar la ruta real de la imagen
  const filePath =
    "./uploads/publications/" + file ||
    path.join(__dirname, "uploads", "publications", file);

  // Comprobar si el archivo existe
  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      return res.status(404).send({
        status: false,
        message: "No se encontró la imagen",
      });
    } else {
      // Devolver el archivo
      return res.sendFile(path.resolve(filePath));
    }
  });
});


module.exports = publicationRouter;
