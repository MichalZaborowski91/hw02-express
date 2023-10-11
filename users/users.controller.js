const { DuplicatedKeyError } = require("../errors/db.errors");
const userDao = require("./users.dao");
const authService = require("../auth/auth.service");

const signupHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const createdUser = await userDao.createUser({ email, password });

    return res.status(201).send({
      user: {
        email: createdUser.email,
        subscription: createdUser.subscription,
      },
    });
  } catch (error) {
    const { message } = error;
    if (error instanceof DuplicatedKeyError) {
      return res.status(409).send({ message });
    }
    return next(error);
  }
};

const loginHandler = async (req, res, next) => {
  try {
    const userEntity = await userDao.getUser(req.body.email);
    if (
      !userEntity ||
      !(await userEntity.validatePassword(req.body.password))
    ) {
      return res.status(401).send({ message: "Email or password is wrong." });
    }
    const userPayload = {
      email: userEntity.email,
      subscription: userEntity.subscription,
    };
    const token = authService.generateAccessToken(userPayload);
    await userDao.updateUser(userEntity.email, { token });
    return res.status(200).send({
      user: userPayload,
      token,
    });
  } catch (error) {
    return next(error);
  }
};

const logoutHandler = async (req, res, next) => {
  try {
    const { email } = req.email;
    await userDao.updateUser(email, { token: null });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const currentHandler = async (req, res, next) => {
  try {
    const { email, subscription } = req.email;
    return res.status(200).send({ user: { email, subscription } });
  } catch (error) {
    console.error(error);
    return res.status(401).send({ message: "Not authorized." });
  }
};

module.exports = {
  signupHandler,
  loginHandler,
  logoutHandler,
  currentHandler,
};
