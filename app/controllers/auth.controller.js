const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

exports.register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      res
        .status(400)
        .handle_response(false, { message: "All input is required" });
    }

    // * check if user already exist
    const old_user = await User.findOne({ email });
    if (old_user) {
      return res
        .status(409)
        .handle_response(false, { message: "Already Exist. Please Login" });
    }

    // * encrypt password
    const encryptedPassword = await getPassword(password);

    // * save user token
    // todo: wait creat user
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    res.status(200).handle_response(true, {
      data: {
        user,
      },
      message: "Register successfully",
    });
  } catch (error) {
    return res.status(500).handle_response(false, {
      messages: "Something is wrong" + error,
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res
        .status(400)
        .handle_response(false, { message: "All input is required" });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // * Create token
      const token = tokenJwt({ id: user._id, email });
      user.token = token;
      return res.status(200).handle_response(true, {
        data: { user },
        message: "Login successfully",
      });
    } else {
      res.status(500).handle_response(false, {
        messages: "Invalid email or password" + user,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).handle_response(false, {
      messages: "Something is wrong" + error,
    });
  }
};

exports.resetPassword = async (req, res) => {
  
  try {
    const { email } = req.user
    const { password, new_password } = req.body;
    if (!(email && password && new_password)) {
      res
        .status(400)
        .handle_response(false, { message: "All input is required" });
    }

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      let myquery = { _id: user._id };
      let newvalues = {
        $set: {
          password: await getPassword(new_password),
          timestamps: Date.now,
        },
      };
      let update = await User.updateOne(myquery, newvalues);
      if (update) {
        return res.status(200).handle_response(true, {
          message: "reset password successfully, Please login again",
        });
      }
      res.status(500).handle_response(false, {
        messages: "reset password Unsuccessfully!",
      });
    } else {
      res.status(403).handle_response(false, {
        messages: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).handle_response(false, {
      messages: "Something is wrong" + error,
    });
  }
};

exports.requestForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res
        .status(400)
        .handle_response(false, { message: "All input is required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      // * Create token
      const token = tokenJwt({ id: user._id, email }, 60 * 2);
      return res.status(200).handle_response(true, {
        data: { token: token },
        message: "Request forget password successful",
      });
    } else {
      res.status(500).handle_response(false, {
        messages: "Invalid email" + user,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).handle_response(false, {
      messages: "Something is wrong" + error,
    });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { new_password } = req.body;
    const { email, user_id } = req.user;
    if (!new_password) {
      res
        .status(400)
        .handle_response(false, { message: "All input is required" });
    }

    let user = await User.findOne({ email });
    if (req.user) {
      let myquery = { _id: user._id };
      let newvalues = {
        $set: {
          password: await getPassword(new_password),
          timestamps: Date.now,
        },
      };
      let update = await User.updateOne(myquery, newvalues);
      if (update) {
        return res.status(200).handle_response(true, {
          message: "reset password successfully, Please login again",
        });
      }
      res.status(500).handle_response(false, {
        messages: "reset password Unsuccessfully!",
      });
    } else {
      res.status(403).handle_response(false, {
        messages: "Invalid email",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).handle_response(false, {
      messages: "Something is wrong",
    });
  }
};

let tokenJwt = (data, exp) => {
  const { id, email } = data;
  return jwt.sign({ user_id: id, email }, process.env.JWT_TOKEN, {
    expiresIn: exp ? exp : process.env.JWT_EXP,
  });
};

let getPassword = async (password) => {
  let salt = await bcrypt.genSalt(saltRounds);
  let hash = await bcrypt.hash(password, salt);
  return hash;
};
