const Wallet = require("../models/WalletSchema");
const Schedule = require("../models/schedule");
const User = require("../models/UserSchema");
const Redis = require("redis");
const redisClient = Redis.createClient();
module.exports = async (req, res, next) => {
  try {
    console.log("schedule is currently running at the background");    
    const users = await User.find({});
    for (let user in users) {
      const schedules = await Schedule.find({ email: user.email,isFulfilled:false });
      for(let i = 0; i< schedules.length; i ++) {
        if (schedules[i].period === "daily") {
          const todays_date = new Date() + "";
          if (todays_date === schedules[i].stop_date) {
            console.log("daily schedule ",schedules[i].period === "daily")
            const user = await schedules[i].updateMany(
              {  },
              { isFullfilled : "true"},
              { new: true,}
            );
            console.log(
              `notification: Your daily service schedule for ${schedules[i].schedule_description} is due for withdrawal`
            );
          }
        } else if (
          schedules[i].isFulfilled === "false" &&
          schedules[i].period === "weekly"
        ) {
          const todays_date = new Date() + "";
          if (schedules[i].stop_date === todays_date) {
            const user = await schedules[i].updateMany(
              {},
              { isFullfilled: "true" },
              { new: true }
            );
            console.log(
              `notification: Your weekly service schedule for ${schedules[i].schedule_description} is due for withdrawal`
            );
          }
        } else if (
          schedules[i].isFulfilled === "false" &&
          schedules[i].period === "bi-weekly"
        ) {
          const todays_date = new Date() + "";
          if (schedules[i].stop_date === todays_date) {
            const user = await schedules[i].updateMany(
              {},
              { isFullfilled: "true"},
              { new: true }
            );
            console.log(
              `notification: Your bi-weekly service schedule for ${schedules[i].schedule_description} is due for withdrawal`
            );
          }
        } else if (
          schedules[i].isFulfilled === "false" &&
          schedules[i].period === "monthly"
        ) {
          const todays_date = new Date() + "";
          if (schedules[i].stop_date === todays_date) {
            const user = await schedules[i].updateMany(
              {},
              { isFullfilled: "true" },
              { new: true }
            );
            console.log(
              `notification: Your monthly service schedule for ${schedules[i].schedule_description} is due for withdrawal`
            );
          }
        } else if (
          schedules[i].isFulfilled === "false" &&
          schedules[i].period === "yearly"
        ) {
          const todays_date = new Date() + "";
          if (schedules[i].stop_date === todays_date) {
            const user = await schedules[i].updateMany(
              {},
              { isFullfilled: "true" },
              { new: true }
            );
            console.log(
              `notification: Your yearly service schedule for ${schedules[i].schedule_description} is due for withdrawal`
            );
          }
        }
      }
    }
  } catch (err) {
    next(err)
  }
};
