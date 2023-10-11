const joi = require("joi");

const schema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  phone: joi.string().required(),
  favorite: joi.boolean(),
});

const validateContactMiddleware = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Missing required name - field" });
  }
  return next();
};

module.exports = {
  validateContactMiddleware,
};
