import User from "../models/user.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

// Salts and hashes password using bcrypt
// Each salt will be unique even with the same password, so it is
// necessary to use bcrypt compare to validate.
const saltHash = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(password, salt);

  return passwordHash;
};

// Validates user using bcrypt compare
const validateUser = async (password, hash) => {
  const isValid = await bcrypt.compare(password, hash);

  return isValid;
};

/**
 * Signup Controller.
 *
 * Salts and hashes user password, creates
 * a new user, then creates a login session
 * for the new user.
 */
export const signup = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const fullName = req.body.name;

  const saltHashPassword = await saltHash(password);

  const user = await User.create({
    email: email,
    fullName: fullName,
    password: saltHashPassword,
  });

  const userWithoutPassword = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
  };

  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({
        msg: "failed to regenerate user session",
      });
    }

    req.session.user = userWithoutPassword;

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          msg: "failed to save user session",
        });
      }

      return res.status(200).json({
        msg: "signup successful",
        data: userWithoutPassword,
      });
    });
  });
};

/**
 * Login controller.
 *
 * Validates user password and regenerates
 * a new login session (new session record with
 * new session ID) and adds user data to it.
 *
 * Session regeneration mitigates session fixation
 * attacks using existing session IDs.
 */
export const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (user === null) {
    return res.status(400).json({
      msg: "user does not exist",
    });
  }

  const userWithoutPassword = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
  };

  const isValid = await validateUser(password, user.password);

  if (!isValid) {
    return res.status(400).json({
      msg: "incorrect email or password",
    });
  }

  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({
        msg: "failed to regenerate user session",
      });
    }

    req.session.user = userWithoutPassword;

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          msg: "failed to save user session",
        });
      }

      return res.status(200).json({
        msg: "login successful",
        data: userWithoutPassword,
      });
    });
  });
};

/**
 * Logout controller.
 *
 * Strips the existing session of user data and
 * saves it to session store. Then regenerates
 * a new session.
 */
export const logout = async (req, res) => {
  req.session.user = null;

  req.session.save((err) => {
    if (err) {
      return res.status(500).json({
        msg: "failed to clear user session and save",
      });
    }

    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({
          msg: "failed to regenerate user session",
        });
      }

      return res.status(200).json({
        msg: "logout successful",
      });
    });
  });
};
