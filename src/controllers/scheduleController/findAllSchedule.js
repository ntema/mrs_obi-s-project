const Schedule = require("../../models/schedule");

const getUserScheduleController = async (req, res) => {
  try {
    const schedules = await Schedule.find({}).populate();
    for(let schedule of schedules) {
      const myschedule = await Schedule.find({
        isFulfilled: "false"
      });
      if(myschedule) {
        return res.status(200).json(myschedule);
      }else {
        const myschedule = await Schedule.find({
          isFulfilled: "true"
        });
        return res.status(200).json(myschedule);
      }
    }
    return res.status(200).json(schedules);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error);
  }
};

module.exports = getUserScheduleController;
