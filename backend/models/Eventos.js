const mongoose = require("mongoose");

const eventoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  contenido: {
    type: String,
    required: true,
  },
  fecha: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Eventos", eventoSchema);
