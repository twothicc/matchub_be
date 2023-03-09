import User from "../models/user.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

const saltHash = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(password, salt);

  return passwordHash;
};

const validateUser = async (password, hash) => {
  const isValid = await bcrypt.compare(password, hash);

  return isValid;
};

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

export const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  const userWithoutPassword = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
  };

  const isValid = await validateUser(password, user.password);

  console.log(isValid);

  if (!isValid) {
    return res.status(401).json({
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
