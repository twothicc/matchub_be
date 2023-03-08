import User from "../models/user.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

const saltHash = async (password) => {
  await bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return hash(password, salt);
    })
    .catch((err) => {
      console.error("failed to hash password", err);
    });
};

const validateUser = async (password, hash) => {
  await bcrypt
    .compare(password, hash)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error("failed to validate user", err);
    });
};

export const signup = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const fullName = req.body.fullName;

  const saltHashPassword = saltHash(password);

  await User.create({
    email: email,
    fullName: fullName,
    password: saltHashPassword,
  })
    .then((res) => {
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).send("failed to regenerate user session");
        }

        req.session.user = {
          id: res.id,
          email: res.email,
          fullName: res.fullName,
        };

        req.session.save((err) => {
          if (err) {
            return res.status(500).send("failed to save user session");
          }
        });
      });
    })
    .catch(() => {
      return res.status(500).send(`failed to create user ${fullName}`);
    });
};

export const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    where: {
      email: email,
    },
  }).catch((err) => {
    console.error(`failed to fetch user with email ${email}`, err);
  });

  const isValid = validateUser(password, user.password);

  if (!isValid) {
    return res.status(401).send("incorrect email or password");
  }

  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).send("failed to regenerate user session");
    }

    req.session.user = req.body.user;

    req.session.save((err) => {
      if (err) {
        return res.status(500).send("failed to save user session");
      }
    });
  });

  return res.status(200).send("login successful");
};

export const logout = async (req, res) => {
  req.session.user = null;

  req.session.save((err) => {
    if (err) {
      return res.status(500).send("failed to clear user session and save");
    }

    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).send("failed to regenerate user session");
      }
    });
  });

  return res.status(200).send("logout successful");
};
