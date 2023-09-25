const user = require("../models/User")

const authAdmin = async (req, res, next) => {
  try {
    const User = await user.findOne({
      _id: req.user.id,
    });

    if (!User) {
      return res.status(400).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (User.role === 0) {
      return res.status(400).json({
        success: false,
        message: "Acceso denegado, no eres admin",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = authAdmin;

