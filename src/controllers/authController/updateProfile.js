import { NextFunction, Request, Response } from "express";

import { User } from "../../models";
import { updateProfileValidator } from "../../validators";

export const updateProfile = async (req,res,next) => {
  try {
    const { error, value } = updateProfileValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message }
      });
    }

    const { _id } = req.user;
    const user = await User.findOneAndUpdate({ _id }, value, { new: true });

    return res.status(200).json({ status: "success", data: user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
