const User = require("../models/user.model");
const config = process.env;

let checkUserSame = async (req, res, next) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (user && user._id) {
      return res.status(409).handle_response(false, {
        messages: `This email is already a user. ===>  ${user._id}`,
      });
    } else {
      return next();
    }
  } catch (error) {
    return res.status(500).handle_response(false, {
      messages: `Something is wrong jjj ${error}`,
    });
  }
};



module.exports = { checkUserSame };
