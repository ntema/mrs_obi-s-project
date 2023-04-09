const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const WalletSchema = new Schema(
  {
    owned_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    flw_ref: {
      type: String,
    },
    order_ref: {
      type: String,
    },
    frequency: {
      type: String,
    },
    expiry_date: {
      type: String,
    },
    response_code: {
      type: String,
    },
    account_reference: {
      type: String,
    },
    account_name: {
      type: String,
    },
    email: {
      type: String,
    },
    country: {
      type: String,
      default: "NG",
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
    },
    mobilenumber: {
      type: String,
    },
    barter_id: {
      type: String,
    },
    id: {
      type: String,
    },
    bank_code: {
      type: String,
    },
    bank_name: {
      type: String,
    },
    nuban: {
      type: String,
    },
    schedulled_funds: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const populateUser = function (next) {
  this.populate("owned_by","_id lastName firstName email");
  next();
};

WalletSchema.pre("find", populateUser)
  .pre("findOne", populateUser)
  .pre("findOneAndUpdate", populateUser)
const Wallet = mongoose.model("Wallet", WalletSchema);
module.exports = Wallet