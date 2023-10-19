const { Schema, model } = require("mongoose");

const ChatSchema = Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User", // Referencia al modelo User
      required: true
    }
  ],
  messages: [
    {
      sender: {
        type: Schema.Types.ObjectId,
        ref: "User" // Referencia al modelo User
      },
      text: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = model("Chat", ChatSchema, "chats");
