const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    txf_reference: {
      type: String,
      required: true,
    },
    kind: {
      type: String,
      enum: ["funding", "withdrawal", "saving"],
      default: "funding",
    },
    status: {
      type: String,
      enum: ["cancel", "pending", "success"],
      default: "pending",
    },
    done_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const populateUser = function (next) {
  this.populate("done_by", "_id lastName firstName phone email");
  next();
};

TransactionSchema.pre("find", populateUser)
  .pre("findOne", populateUser)
  .pre("findOneAndUpdate", populateUser);

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;