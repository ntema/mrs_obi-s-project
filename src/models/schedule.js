const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const scheduleSchema = new mongoose.Schema({
  start_date: {
    type: String,
    required: true,
  },
  stop_date: {
    type: String,
    required: true,
  },
  schedule_description: {
    type: String,
    required: true,
  },
  schedulledBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String,
  },
  recurrentSchedule: {
    type: Boolean,
    default: false,
  },
  wallet: {
    type: Schema.Types.ObjectId,
    ref: "Wallet",
  },
  isFulfilled: {
    type: Boolean,
    default: false,
  },
  schedulled_funds: {
    type: Number,
  },
  period: {
    type: String,
    enum: ["daily", "weekly", "bi-weekly", "monthly", "yearly"],
    default: "daily",
  },
});
const populateWallet = function (next) {
    this.populate("wallet");
    next();
};
  
const populateUser = function (next) {
    this.populate("schedulledBy");
    next();
};
  
  scheduleSchema
    .pre("find", populateUser)
    .pre("findOne", populateUser)
    .pre("findOneAndUpdate", populateUser);

    scheduleSchema
      .pre("find", populateWallet)
      .pre("findOne", populateWallet)
      .pre("findOneAndUpdate", populateWallet);

const Schedule = mongoose.model('Schedule', scheduleSchema)
module.exports = Schedule;