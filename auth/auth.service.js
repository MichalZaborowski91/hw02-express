const JWT = require("jsonwebtoken");
const { jwtSecret, jwtLifetime } = require("../config");

const generateAccessToken = (user) => {
  return JWT.sign(user, jwtSecret, { expiresIn: jwtLifetime });
};

const verifyToken = (token) => {
  try {
    return JWT.verify(token, jwtSecret);
  } catch (error) {
    console.error(error);
    if (error instanceof JWT.TokenExpiredError) {
      throw new Error("Token expired.");
    }
    if (error instanceof JWT.JsonWebTokenError) {
      throw new Error("Token is invalid.");
    }
    throw new Error("Unknown token verification error.");
  }
};

module.exports = {
  generateAccessToken,
  verifyToken,
};
