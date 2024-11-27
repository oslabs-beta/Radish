const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const registerUser = async (req, res) => {
  console.log("request to register user", req.body);
  try {
    const { firstName, lastName, email, password } = req.body;

    // check that all fields have been provided
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ error: "Please add all required fields" });
      return;
    }

    // check if user already exists
    const userExists = await User.findOne({ email });

    // console.log(userExists);
    if (userExists) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.cookie("authToken", generateToken(user._id), { httpOnly: true });
      return res.status(201).json({ token: generateToken(user._id) });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res, next) => {
  console.log("request to login user", req.body);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log("attempting to find user:", user);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // For testing the catch block for the loginUser controller
    // throw new Error('Intentional error for testing');
    console.log("success");
    const token = generateToken(user._id);
    res.cookie("authToken", token, { httpOnly: true });
    const ips = user.clusterIPs;
    res.status(200).json({ token, ips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  const user = await User.findById(req.user.id);
  try {
    res
      .status(200)
      .cookie("authToken", generateToken(user._id), { httpOnly: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const saveCluster = async (req, res, next) => {
  const { vpcID, subnetId, amiPublicKey, amiSecretKey, region, masterAuth } =
    req.body;

  if (!res.locals.user) {
    next();
  }
  const user = res.locals.user;
  console.log("user in saveCluster", user);
  try {
    await User.findOneAndUpdate(
      { _id: user._id },
      {
        vpcID: vpcID,
        amiPublicKey: amiPublicKey,
        amiSecretKey: amiSecretKey,
        region: region,
        clusterIPs: res.locals.ips,
        clusterPassword: masterAuth,
      },
      { new: true }
    );

    console.log("user after set", user);
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getClusterIps = async (req, res, next) => {
  try {
    const user = await User.findById(res.locals.user.id);
    res.locals.ips = user.clusterIPs;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// generate json web token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  saveCluster,
  getClusterIps,
};
