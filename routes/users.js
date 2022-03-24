var express = require("express");
var router = express.Router();
const auth_middleware = require("../app/middlewares/auth.middleware");
const user_middleware = require("../app/middlewares/user.middleware");
const user_controller = require("../app/controllers/user.controller");

const { check, validationResult } = require("express-validator");

/* GET users listing. */
router.get("/", [auth_middleware.verifyToken, user_controller.userList]);

router.get("/:{id}", [auth_middleware.verifyToken, user_controller.userOne]);

router.post(
  "/add/",
  [
    check("first_name", "Plese input your First name").not().isEmpty(),
    check("last_name", "Plese input your Last name").not().isEmpty(),
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
  },
  [
    auth_middleware.verifyToken,
    user_middleware.checkUserSame,
    user_controller.userAdd,
  ]
);

router.post(
  "/add/",
  [
    check("first_name", "Plese input your First name").not().isEmpty(),
    check("last_name", "Plese input your Last name").not().isEmpty(),
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
  },
  [
    auth_middleware.verifyToken,
    user_middleware.checkUserSame,
    user_controller.userAdd,
  ]
);

module.exports = router;
