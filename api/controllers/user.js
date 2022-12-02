import User from "../models/user";

export const read = (req, res, next) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;

  User.findOne({ _id: req.profile._id }).exec((err, user) => {
    //if has error means the user is not authorized
    if (err || !user)
      return res.status(401).json({
        error: "User not found."
      });

    return res.json({ user });
  });
};
