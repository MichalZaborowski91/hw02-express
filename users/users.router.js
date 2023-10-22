const { Router } = require("express");
const usersController = require("./users.controller");
const { validateUserMiddleware } = require("./users.validators");
const { authMiddleware } = require("../auth/auth.middleware");
const multer = require("multer");
const path = require("path");

const upload = multer({
  dest: path.join(__dirname, "tmp"),
});

const userRouter = Router();

userRouter.post(
  "/signup",
  validateUserMiddleware,
  usersController.signupHandler
);
userRouter.post("/login", validateUserMiddleware, usersController.loginHandler);
userRouter.post("/logout", authMiddleware, usersController.logoutHandler);
userRouter.get("/current", authMiddleware, usersController.currentHandler);
userRouter.get("/secret", authMiddleware, (req, res) =>
  res.status(200).send({ message: "Hello from secret area." })
);
userRouter.get("/verify/:verificationToken", usersController.verifyHandler);
userRouter.post("/verify", usersController.resendVerificationHandler);
userRouter.patch(
  "/avatars",
  upload.single("avatarURL"),
  authMiddleware,
  usersController.updateAvatarHandler
);

module.exports = {
  userRouter,
};
