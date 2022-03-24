const User = require("../models/user.model");
const bcrypt = require("bcrypt");

let userList = async (req, res) => {
  try {
    let users = await User.find();
    return res.status(200).handle_response(true, {
      data: { users },
    });
  } catch (error) {
    console.log(`error + ${error.message}`);
    res.status(500).handle_response(false, {
      message: "something is wrong",
    });
  }
  return res.status(500).handle_response(false, {
    message: "something is wrong",
  });
};

let userOne = async (req, res) => {
  try {
    const { id } = req.params.id;
    let user = await User.findOne({ id });
    return res.status(200).handle_response(true, {
      data: { user },
    });
  } catch (error) {
    console.log(`error + ${error.message}`);
    res.status(500).handle_response(false, {
      message: "something is wrong",
    });
  }
  return res.status(500).handle_response(false, {
    message: "something is wrong",
  });
};

let userAdd = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      res
        .status(400)
        .handle_response(false, { message: "All input is required" });
    }
    
    // * encrypt password
    encryptedPassword = await bcrypt.hash(password, 10);

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
      message: "add user successfully",
    });
  } catch (error) {
    return res.status(500).handle_response(false, {
      messages: "Something is wrong add user",
    });
  }
};

module.exports = { userList, userOne, userAdd };
