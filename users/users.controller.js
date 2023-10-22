const { DuplicatedKeyError } = require("../errors/db.errors");
const userDao = require("./users.dao");
const authService = require("../auth/auth.service");
const gravatar = require("gravatar");
const jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const mimetypes = require("mime-types");
const { User } = require("./user.model");
const { sendUserVerificationMail } = require("./user.mailer.service");

const signupHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const avatarURL = gravatar.url(
      email,
      {
        default: "retro",
      },
      true
    );
    const createdUser = await userDao.createUser({
      email,
      password,
      avatarURL,
    });

    await sendUserVerificationMail(
      createdUser.email,
      createdUser.verificationToken
    );

    return res.status(201).send({
      user: {
        email: createdUser.email,
        subscription: createdUser.subscription,
        avatarURL,
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
    const userEntity = await userDao.getUser({ email: req.body.email });
    if (
      !userEntity ||
      !(await userEntity.validatePassword(req.body.password))
    ) {
      return res.status(401).send({ message: "Email or password is wrong." });
    }

    if (!userEntity.verified) {
      return res.status(403).send({ message: "User is not verified." });
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

const updateAvatarHandler = async (req, res) => {
  try {
    // console.log(req.file);
    const userEntity = await userDao.getUser(req.body.email);
    const avatarTitle = userEntity.email;
    const fileName = `${avatarTitle}_${Date.now()}.${mimetypes.extension(
      req.file.mimetype
    )}`;
    const avatarImage = await jimp.read(req.file.path);
    const resizedAvatar = avatarImage.resize(250, 250);
    await resizedAvatar.writeAsync(req.file.path);
    await fs.rename(
      req.file.path,
      path.join(__dirname, "../public/avatars", fileName)
    );

    const updatedUser = await User.findOneAndUpdate(
      { email: userEntity.email },
      {
        avatarURL: `${req.protocol}://${req.headers.host}/avatars/${fileName}`,
      },
      { new: true }
    );

    return res.status(201).send({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyHandler = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await userDao.getUser({ verificationToken });
    if (!user) {
      return res
        .status(400)
        .send({ message: "Verification token expired or is not valid." });
    }
    if (user.verified) {
      return res.status(400).send({ message: "User is verified already." });
    }
    await userDao.updateUser(user.email, {
      verified: true,
      verificationToken: null,
    });
    return res.status(200).send({ message: "User has been verified." });
  } catch (error) {
    return next(error);
  }
};

const resendVerificationHandler = async (req, res, next) => {
  try {
    const user = await userDao.getUser({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User does not exist." });
    }
    if (user.verified) {
      return res.status(400).send({ message: "User is verified already." });
    }
    await sendUserVerificationMail(user.email, user.verificationToken);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signupHandler,
  loginHandler,
  logoutHandler,
  currentHandler,
  updateAvatarHandler,
  verifyHandler,
  resendVerificationHandler,
};
