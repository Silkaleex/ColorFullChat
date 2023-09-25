const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(400).send({
        success: false,
        message: "Invalid Authentification(falta token)",
      });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (error, user) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid Authentification(token no valido)",
        });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = auth;