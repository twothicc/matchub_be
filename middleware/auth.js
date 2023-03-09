export const auth = async (req, res, next) => {
  console.log("middleware authenticating");

  if (req.session.user) {
    next();
  } else {
    return res.status(401).json({
      msg: "unauthorized user",
    });
  }
};
