const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let sessionSchema = new Schema({
  sessionId: { type: String, unique: true, required: true },
  fromAddress: { type: String },
  toAddress: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
  perHourCost: { type: Number, required: true },
  peerId: { type: String, required: true },
  durationInSecond: { type: Number },
  fileURL: { type: String },
  NFTContractAddress: { type: String },
  NFTItemId: { type: String },
  oceanProtocolURL: { type: String },
});

// Export the model
module.exports = mongoose.model("session", sessionSchema);
