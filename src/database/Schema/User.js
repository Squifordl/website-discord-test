const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  username: String,
  avatarUrl: String,
  discriminator: String,
  description: String,
  messages: [{ text: String, timestamp: Date }],
  lastLogin: Date
});
const UserTeste = mongoose.model("UserTeste", userSchema);

module.exports = UserTeste;
