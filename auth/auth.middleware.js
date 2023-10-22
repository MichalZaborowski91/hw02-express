const authService = require("./auth.service");
const userDao = require("../users/users.dao");

const extractTokenFromHeaders = (headers) => {
  return headers.authorization.replace("Bearer ", "");
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = extractTokenFromHeaders(req.headers);

    if (!token) {
      throw new Error("Authorization token is missing.");
    }
    const { email } = authService.verifyToken(token);
    const userEntity = await userDao.getUser({ email });
    if (!userEntity || userEntity.token !== token) {
      throw new Error("Token is invalid");
    }
    req.email = userEntity;
    req.user = userEntity._id;
    return next();
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

module.exports = {
  authMiddleware,
};
