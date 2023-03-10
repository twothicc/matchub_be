/**
 * Authorization middleware.
 *
 * Authenticates the user by checking if the
 * session has user data.
 *
 * All valid sessions will have user data.
 */
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
