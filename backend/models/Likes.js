const { Schema, model } = require("mongoose");

const LikeSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  publication: {
    type: Schema.ObjectId,
    ref: "Publication",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Like", LikeSchema, "likes");
