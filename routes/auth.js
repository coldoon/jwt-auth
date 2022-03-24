var express = require("express");
const router = express.Router();
const auth_middleware = require("../app/middlewares/auth.middleware");
const auth_controller = require("../app/controllers/auth.controller");

const { check, validationResult } = require("express-validator");

// Routes
/**
 * @swagger
 * /auth/:
 *  get:
 *    description: Get Profile
 *    tags:
 *      - Auth
 *    consumes:
 *      - "application/json"
 *    produces:
 *      - "application/json"
 *    parameters:
 *      - in: header
 *        name: Language
 *        type: string
 *        required: true
 *        default: "TH"
 *        description: TH for Thai or EN for English.
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: false
 *        default: ""
 *        description:  Enter your token for authentication.
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad Required
 *      '500':
 *        description: Something Wrong
 */
router.get("/", function (req, res, next) {
  return res.send("hi");
});

// Routes
/**
 * @swagger
 * /auth/sign-up/:
 *  post:
 *    description: Sign-up
 *    tags:
 *      - Auth
 *    consumes:
 *      - "application/json"
 *    produces:
 *      - "application/json"
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user to create.
 *        schema:
 *          type: object
 *          required:
 *            - first_name
 *            - last_name
 *            - email
 *            - password
 *          properties:
 *            first_name:
 *              type: string
 *              example: "tets1"
 *            last_name:
 *              type: string
 *              example: "last-n"
 *            email:
 *              type: string
 *              example: "test1@test.com"
 *            password:
 *              type: string
 *              example: "P@ssw0rd"
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad Required
 *      '500':
 *        description: Something Wrong
 */
router.post(
  "/sign-up/",
  [
    check("first_name", "Plese input your First name").not().isEmpty(),
    check("last_name", "Plese input your Last name").not().isEmpty(),
    check("email", "Your email is required").isEmail(),
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
  auth_controller.register
);

// Routes
/**
 * @swagger
 * /auth/sign-in/:
 *  post:
 *    description: Sign-in
 *    tags:
 *      - Auth
 *    consumes:
 *      - "application/json"
 *    produces:
 *      - "application/json"
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user to login.
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *          properties:
 *            email:
 *              type: string
 *              example: "test1@test.com"
 *            password:
 *              type: string
 *              example: "P@ssw0rd"
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad Required
 *      '500':
 *        description: Something Wrong
 */
router.post(
  "/sign-in/",
  [
    check("email", "Your email is required").isEmail(),
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
  [auth_controller.signIn]
);

// Routes
/**
 * @swagger
 * /auth/request-password/:
 *  post:
 *    description: request-password
 *    tags:
 *      - Auth
 *    consumes:
 *      - "application/json"
 *    produces:
 *      - "application/json"
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user request password.
 *        schema:
 *          type: object
 *          required:
 *            - email
 *          properties:
 *            email:
 *              type: string
 *              example: "test1@test.com"
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad Required
 *      '500':
 *        description: Something Wrong
 */
router.post(
  "/request-password/",
  [
    check("email", "Your email is required").isEmail(),
    check("email", "Plese input your Email").not().isEmpty(),
  ],
  (req, res, next) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      return res.status(422).handle_response(false, { message: error.array() });
    } else {
      next();
    }
  },
  [auth_controller.requestForgetPassword]
);

// Routes
/**
 * @swagger
 * /auth/forget-password/:
 *  put:
 *    description: forget-password
 *    tags:
 *      - Auth
 *    consumes:
 *      - "application/json"
 *    produces:
 *      - "application/json"
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *        default: ""
 *        description:  Enter your token for authentication.
 *      - in: body
 *        name: user
 *        description: The user to create.
 *        schema:
 *          type: object
 *          required:
 *            - new_password
 *          properties:
 *            new_password:
 *              type: string
 *              example: "123456"
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad Required
 *      '500':
 *        description: Something Wrong
 */
router.put(
  "/forget-password/",
  [check("new_password", "Plese input your new password").not().isEmpty()],
  (req, res, next) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      res.status(422).handle_response(false, { message: error.array() });
    } else {
      next();
    }
  },
  [auth_middleware.verifyToken, auth_controller.forgetPassword]
);

// Routes
/**
 * @swagger
 * /auth/reset-password/:
 *  put:
 *    description: reset-password
 *    tags:
 *      - Auth
 *    consumes:
 *      - "application/json"
 *    produces:
 *      - "application/json"
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *        default: ""
 *        description:  Enter your token for authentication.
 *      - in: body
 *        name: user
 *        description: The user to create.
 *        schema:
 *          type: object
 *          required:
 *            - password
 *            - new_password
 *          properties:
 *            password:
 *              type: string
 *              example: "P@ssw0rd"
 *            new_password:
 *              type: string
 *              example: "123456"
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad Required
 *      '500':
 *        description: Something Wrong
 */
router.put(
  "/reset-password/",
  [check("password", "Plese input your password").not().isEmpty()],
  [check("new_password", "Plese input your new password").not().isEmpty()],
  (req, res, next) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      res.status(422).handle_response(false, { message: error.array() });
    } else {
      next();
    }
  },
  [auth_middleware.verifyToken, auth_controller.resetPassword]
);

module.exports = router;
