const {
  DuplicatedKeyError,
  UnknownDatabaseError,
} = require("../errors/db.errors");
const { User } = require("./user.model");
const { v4: uuid } = require("uuid");

const createUser = async (userData) => {
  try {
    return await User.create({
      ...userData,
      verified: false,
      verificationToken: uuid(),
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      const [[key, value]] = Object.entries(error.keyValue); // error 11000 email in use already
      throw new DuplicatedKeyError(key, value);
    }
    throw new UnknownDatabaseError();
  }
};

const getUser = async (filter) => {
  try {
    return await User.findOne(filter);
  } catch (error) {
    console.error(error);
    throw new UnknownDatabaseError();
  }
};

const updateUser = async (email, userData) => {
  try {
    return await User.findOneAndUpdate({ email }, userData);
  } catch (error) {
    console.error(error);
    throw new UnknownDatabaseError();
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
};
