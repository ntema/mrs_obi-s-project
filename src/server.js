const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT ;
const cors  = require("cors");
const dbURI =  process.env.dbURI;
const time_schedule_config = require("./config/scheduleTimeline");
const {
  initCrons,
} = require("./controllers/scheduleController/cronSchedule");


const corsOptions = {
  origin: "*",
  credentials: true, 
  optionSuccessStatus: 200,
};

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(cors(corsOptions));

//middlewares
app.use(express.urlencoded({ limit: "1000000mb", extended: true }));
app.use(express.json({ limit: "1000000mb", extended: true }));

//mongoDB connection
const conns = mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err.message);
  });


app.get("/", (req, res) => {
  res.status(200).json({
    message: "We're up and running"
  })
});

//background service schedule
const setSchedule = initCrons(time_schedule_config);
//auth routes
app.use("/api/v1/auth", require("./routes/auth/register"));
app.use("/api/v1/auth", require("./routes/auth/login"));
app.use("/api/v1/auth", require("./routes/auth/otp"));
app.use("/api/v1/auth", require("./routes/auth/forgotPassword"));
//user routes
app.use("/api/v1/user", require("./routes/userRoutes/getAllUser"));
app.use("/api/v1/user", require("./routes/userRoutes/getSingleUser"));
app.use("/api/v1/user", require("./routes/userRoutes/updateUser"));
app.use("/api/v1/user", require("./routes/userRoutes/deleteUser"));
//transaction routes
app.use("/api/v1/transaction", require("./routes/transaction/paystack"));
app.use("/api/v1/transaction", require("./routes/transaction/flutterwave"));

app.use("/api/v1/transaction", require("./routes/transaction/creditWallet"));
app.use("/api/v1/transaction", require("./routes/transaction/withdraw"));
app.use("/api/v1/transaction", require("./routes/transaction/transfer"));
app.use(
  "/api/v1/transaction",
  require("./routes/transaction/generateAccountDetails")
);
app.use(
  "/api/v1/transaction",
  require("./routes/transaction/fundWithUssd")
);
//cron 
app.use(
  "/api/v1/cron_schedule",
  require("./routes/schedule/createfundSchedule")
);
app.use(
  "/api/v1/fund_service",
  require("./routes/schedule/createfundSchedule")
);
//wallet
app.use("/api/v1/wallet", require("./routes/wallet/getUserWallet"));

//generate qrcode
app.use("/api/v1/L2L_transfer", require("./routes/L2L_transfer/L2L_transfer"));

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  if(res.status(error.status || 500)){
    if(res.headersSent !== true) {
      return res.json({
        error: {
          status: error.status || 500,
          message: error.message,
        },
      });
    }
  }
});

app.listen(port, () => {
  console.log("server running on port 3000");
});
