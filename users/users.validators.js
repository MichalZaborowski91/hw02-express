const joi = require("joi");

const schema = joi.object({
  password: joi.string().required(),
  email: joi.string().email().required(),
});

const validateUserMiddleware = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.message });
  }
  return next();
};

module.exports = {
  validateUserMiddleware,
};
