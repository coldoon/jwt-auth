const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const config = process.env;

const validateSignUp = [
  check("first_name", "Plese input your First name").not().isEmpty(),
  check("last_name", "Plese input your Last name").not().isEmpty(),
  check("email", "Your email is requirde").isEmail(),
  check("email", "Plese input your Email").not().isEmpty(),
  check("password", "Plese input your password").not().isEmpty(),
];

const validateSignIn =
  ([
    check("email", "Your email is requirde").isEmail(),
    check("email", "Plese input your Email").not().isEmpty(),
    check("password", "Plese input your password").not().isEmpty(),
  ],
  (req, res, next) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      res.status(422).handle_response(false, { message: error.array() });
    } else {
      next();
    }
  });

const verifyToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization;
    if (!token) {
      return res.status(403).handle_response(false, {
        messages: "A token is required for authentication",
      });
    }
    try {
      const decoded = jwt.verify(token, config.JWT_TOKEN);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).handle_response(false, {
        messages: "Invalid Token",
      });
    }
    
  } catch (error) {
    return res.status(500).handle_response(false, {
      messages: "Something is wrong",
    });
  }
};

module.exports = {
  validateSignUp,
  validateSignIn,
  verifyToken,
};
