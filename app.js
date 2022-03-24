const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const SWAGGER_CONFIG = require("./config/swagger");

require("dotenv").config();
require("./config/database").connect();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const app = express();
const port = process.env.API_PORT;

function handle_response(res, success, options = {}) {
  if (success) {
    let { data, message } = options;
    let response = {};
    if (message) {
      response.message = message;
    }

    if (data) {
      response.data = data;
    }

    return res.json({
      success: true,
      response,
    });
  } else {
    let { code, message, messages, message_params, data } = options;
    return res.json({
      success: false,
      response: {
        data,
        error_code: code,
        error_message: message,
        error_messages: messages,
      },
    });
  }
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.handle_response = handle_response.bind(null, res);
  next();
});
SWAGGER_CONFIG(app);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});



app.listen(port, () => {
  console.log("Application is running on port " + port);
});

module.exports = app;
