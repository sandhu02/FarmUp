const mongoose = require("mongoose");

const marketSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ["vegetable", "fruit"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    default: "kg", // could also be dozen, etc.
  },
  region: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // optional: to simulate 7-day price trends
  priceHistory: [
    {
      date: { type: Date },
      price: { type: Number },
    },
  ],
});

module.exports = mongoose.model("Market", marketSchema);
