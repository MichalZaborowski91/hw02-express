const { Router } = require("express");
const usersController = require("./users.controller");
const { validateUserMiddleware } = require("./users.validators");
const { authMiddleware } = require("../auth/auth.middleware");

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

module.exports = {
  userRouter,
};
