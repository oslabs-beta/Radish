const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  console.log("cookies", req.cookies);
  // if (req.headers.authorization !== 'Bearer null' && req.headers.authorization.startsWith('Bearer')) {
  //   // Get token from header
  //   token = req.headers.authorization.split(' ')[1];
  // } else if (req.cookies.authToken) {
  //   token = req.cookies.authToken;
  // }
  token = req.cookies.authToken;
  console.log("token: ", token);
  try {
    // Verify token
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get user from the token, not including the hashed password
      req.user = await User.findById(decoded.id).select("-password");
      console.log(req.user);
      return next();
    } else {
      next({ message: "Not authorized", status: 401 });
    }
  } catch (error) {
    console.error("Error in protect middleware:", error);
    res.status(401).json({ error: "Not authorized" });
  }
};

const verifyCookie = async (req, res, next) => {
  console.log("verifyCookie");
  console.log("req.cookies", req.cookies);

  const token = req.cookies.authToken;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    console.log("user data", user);
    console.log("exiting verifyCookie");

    if (!user) {
      return res.status(401).json({ error: "Not authorized, no user found" });
    }
    console.log("going to next");
    res.locals.user = user;
    console.log("now im going to next");
    next();
    console.log("nexted");
  } catch (error) {
    console.error("Error in verifyCookie middleware:", error);
    res.status(401).json({ error: "Not authorized" });
  }
  // console.log('still here');
  // next();
  // console.log('still here!!!');
};

const checkUser = async (req, res, next) => {
  const token = req.cookies.authToken;
  console.log("token", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    // console.log('user', user);
    if (!user) {
      next();
    }
    res.locals.user = user;
    // console.log('res.locals.user', res.locals.user);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect, verifyCookie, checkUser };
