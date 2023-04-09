const { resolve } = require("path");
const cron = require("node-cron");

module.exports = {
  initCrons: (config) => {
    Object.keys(config).forEach((key) => {
      if (cron.validate(config[key].frequency)) {
        cron.schedule(config[key].frequency, (err) => {
          const handler = require(resolve(config[key].handler));
          handler();
          if (err) {
            console.log(err);
            return err
          }
        });
      } else {
        console.log("invalid date-time format");
        return "invalid date-time format";
      }
    });
  },
};
