import express, { Request, Response } from "express";

const path = require("path");
const User = require("./models/User");
const bodyParser = require("body-parser");
const { createFiles } = require("./controllers/fileGenerationController");
const { getEC2Pricing } = require("./controllers/awsPricingController");
const { checkUser, verifyCookie } = require("./controllers/authController");
const { saveCluster } = require("./controllers/userController");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const {
  connectUserRedis,
  getMemory,
  getUsedCPU,
  disconnectRedis,
  runBenchmark,
} = require("./controllers/performanceController");

const {
  createSecurityGroup,
  launchEC2s,
} = require("./controllers/awsSDKController");

// connect to MongoDB cluster
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();

const app = express();
const port = 8080;

// Load .env variables
require("dotenv").config();

// Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, "../public/index.html"));
});

app.use(cookieParser());

app.use("/api/users", require("./routes/userRoutes"));

// POST route to handle form submission and write redis.conf file
app.post("/api/createFiles", createFiles, (req: Request, res: Response) => {
  res.status(200).send("Files created successfully");
});

// Post route to handle the fetching of EC2 pricing given inputs from the front end
app.post("/api/getPricing", getEC2Pricing, (req: Request, res: Response) => {
  console.log("sending pricing terms array");
  res.status(200).json(res.locals.pricingTermsArray);
});

app.post("/api/createTaskDefinition", (req: Request, res: Response) => {
  res.status(200).send("Task definition created successfully");
});

app.post(
  "/api/memory",
  checkUser,
  connectUserRedis,
  getMemory,
  disconnectRedis,
  (req, res) => {
    console.log("backend", res.locals.memory);
    res.status(200).json(res.locals.memory);
  }
);

app.post(
  "/api/cpu",
  checkUser,
  connectUserRedis,
  getUsedCPU,
  disconnectRedis,
  (req, res) => {
    console.log("sending CPU data: ", res.locals.getUsedCPU);
    res.status(200).json(res.locals.getUsedCPU);
  }
);

app.post(
  "/api/testSecurityGroup",
  createSecurityGroup,
  (req: Request, res: Response) => {
    res.status(200).send("Security Group Created");
  }
);

app.post(
  "/api/launchEC2",
  checkUser,
  createSecurityGroup,
  launchEC2s,
  checkUser,
  saveCluster,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.ips);
  }
);

app.get(
  "/api/benchmark",
  verifyCookie,
  runBenchmark,
  (req: Request, res: Response) => {
    console.log("backend", res.locals.benchmark);
    res.status(200).json(res.locals.benchmark);
  }
);

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("error", err);
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 400,
    message: { err: "An error occurred" },
    ...err,
  };
  console.log("error status", defaultErr.status);
  res.status(defaultErr.status).json(defaultErr.message);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
