const mongoose = require("mongoose");
const http = require("http");
const express = require("express");
const cors = require("cors");
const multer = require("multer");

mongoose.set('strictQuery', false);

require("dotenv").config();
const app = express();

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now(); // Agregar un timestamp al nombre del archivo para que sea único
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  // El archivo se ha subido exitosamente, puedes acceder a él en req.file
  const uploadedFile = req.file;

  res.status(200).send({
    success: true,
    message: "Imagen subida correctamente",
    file: uploadedFile,
  });
});

//convertimos body en un objeto Json
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/upload", express.static("uploads/avatars"));
app.use("/api/upload", express.static("uploads/publications"));

// Rutas
const userRouter = require("./routes/UserRouter");
const eventosRouter = require("./routes/EventosRouter");
const followRouter = require("./routes/FollowRouter");
const publicationRouter = require("./routes/PublicationRouter");
const ChatRouter = require("./routes/ChatRouter");
const PeticionRouter = require("./routes/PeticionRouter");

app.use("/api", userRouter);
app.use("/api", eventosRouter);
app.use("/api", followRouter);
app.use("/api", publicationRouter);
app.use("/api", ChatRouter);
app.use("/api",PeticionRouter);


//cargando rutas
const URL = process.env.mongo_db;

mongoose
  .connect(URL, {})
  .then(() => {
    console.log("los servidores estan en funcionamiento");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(5000, () => {
  console.log("todo en funcionamiento en el puerto 5000");
});
