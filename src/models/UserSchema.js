const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    generatedAccountNumber: {
      type: Object,
    },
    gender: {
      type: String,
    },
    birthdate: {
      type: String,
    },
    address: {
      type: String,
    },
    nextofkin: {
      type: String,
    },
    password: {
      type: String,
      select: false,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    registration_status: {
      type: String,
      enum: ["REGISTERED", "UNREGISTERED"],
      default: "UNREGISTERED",
    },
    bvn: {
      type: String,
    },
    isActivated: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    validIdMedia: {
      type: Object,
      select: false,
    },
    validIdURL: {
      type: String,
    },
    avatarMedia: {
      type: Object,
      select: false,
    },
    avatarURL: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    require("../config/constants").TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  return token;
};
UserSchema.methods.generateAdminJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    require("../config/constants").ADMIN_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  return token;
};
const populateUser = function (next) {
  this.populate("wallet"), 
  this.populate("schedule"); 
  next();
};

UserSchema.pre("find", populateUser);
 UserSchema.pre("findOne", populateUser);
 UserSchema.pre("findOneAndUpdate", populateUser);
module.exports = mongoose.model("User", UserSchema);
