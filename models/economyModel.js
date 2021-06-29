const mongoose = require("mongoose")

const economyModel = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
  coins: { type: Number, default: 0 },
  lastWork: { type: Date, default: Date.now() },
  lastCrime: { type: Date, default: Date.now() },
  lastDaily: { type: Date, default: Date.now() },
  lastWeekly: { type: Date, default: Date.now(), },
  lastMonthly: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('economy', economyModel)