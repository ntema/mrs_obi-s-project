const Joi = require("joi");
const Schema = Joi.object({
  Date: Joi.string().required(),
});
try {
  //playing around with date time object
  const { error, value } = Schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: { message: error.details[0].message },
    });
  }
  let date_time = new Date();
  let date = ("0" + date_time.getDate()).slice(-2);
  let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
  let year = date_time.getFullYear();
  let hours = date_time.getHours();
  let minutes = date_time.getMinutes();
  let seconds = date_time.getSeconds();
  console.log(date_time);
  console.log(date);
  console.log(year + "-" + month + "-" + date);
  console.log(
    year + "-" + month + "-" + date + "" + hours + ":" + minutes + ":" + seconds
  );

  let timestamp = Date.now(); //timestamp in milliseconds
  const ts_in_seconds = Math.floor(timestamp / 1000);
  console.log(timestamp);
  console.log(ts_in_seconds);

  //converting timestamp to date
  let ts = Date.now();
  let dateTime = new Date(ts);
  let getdate = dateTime.getDate();
  let getmonth = dateTime.getMonth() + 1;
  let getyear = dateTime.getFullYear();
  console.log(getyear + "-" + getmonth + "-" + getdate);
///
const et = Math.floor(Date.now()) - 24 * 3600;
const tet = new Date(et);

} catch (e) {}

module.exports = {
  daily: {
    frequency: "* * * * *",
    handler: "./src/handlers/daily",
  }
};
