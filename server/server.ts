
import express, { Request, Response } from 'express';

// const { Request, Response } = require('express');
const path = require('path');
const User = require('./models/User');
const { getClusterIps } = require('./controllers/userController');
// import { verifyCookie } from './controllers/authController';
const bodyParser = require('body-parser');
const { createClient } = require('redis');
const { createFiles } = require('./controllers/fileGenerationController');
const { getEC2Pricing } = require('./controllers/awsPricingController');
const { checkUser, verifyCookie } = require('./controllers/authController');
const { saveCluster } = require('./controllers/userController');
const Redis = require('ioredis');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const {
  connectUserRedis,
  getMemory,
  getUsedCPU,
  disconnectRedis,
  runBenchmark,
} = require('./controllers/performanceController');
// const { createSecurityGroupScript } = require("./controllers/bashScriptController");
// const { createSecurityGroupDefinition } = require("./controllers/jsonDefinitionController");
const {
  createSecurityGroup,
  launchEC2s,
  testIPRequest,
} = require('./controllers/awsSDKController');

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
require('dotenv').config();

// Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

console.log('Connect to Redis?', process.env.USE_REDIS);
console.log('Redis Password:', process.env.REDIS_PASSWORD);

// Connect to redis cluster when the docker-compose file tells us to do so
// if (process.env.USE_REDIS === 'true') {
//   const redisMaster = createClient({
//     url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//   });

//   redisMaster.on('error', (err: Error) =>
//     console.error('Redis Master Error:', err)
//   );

//   redisMaster
//     .connect()
//     .then(() =>
//       console.log(
//         `Redis client connected to ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
//       )
//     )
//     .catch((err: Error) =>
//       console.error('Redis Master Connection Error:', err)
//     );

//   app.get('/', async (req: Request, res: Response) => {
//     try {
//       let counter = await redisMaster.get('counter');
//       if (!counter) {
//         await redisMaster.set('counter', 1);
//         counter = 1;
//       } else {
//         counter = parseInt(counter) + 1;
//         await redisMaster.set('counter', counter);
//       }
//       res.send(counter.toString());
//       console.log('counter:', counter);
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   });
// }
app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req: Request, res: Response) => {
	res.status(200).sendFile(path.join(__dirname, '../public/index.html'))
});

app.use(cookieParser());
app.use('/api/users', require('./routes/userRoutes'));

// POST route to handle form submission and write redis.conf file
app.post('/api/createFiles', createFiles, (req: Request, res: Response) => {
  res.status(200).send('Files created successfully');
});

// Post route to handle the fetching of EC2 pricing given inputs from the front end
app.post('/api/getPricing', getEC2Pricing, (req: Request, res: Response) => {
  console.log('sending pricing terms array');
  res.status(200).json(res.locals.pricingTermsArray);
});

app.post('/api/createTaskDefinition', (req: Request, res: Response) => {
  res.status(200).send('Task definition created successfully');
});

app.post(
  '/api/memory',
  checkUser,
  connectUserRedis,
  getMemory,
	disconnectRedis,
  /*disconnectRedis,*/ (req, res) => {
    //res.status(200).send("connect to redis");
    console.log('backend', res.locals.memory);
    res.status(200).json(res.locals.memory);
  }
);
//add connectUserRedis if connect to redis cloud

app.post(
  '/api/cpu',
    checkUser,
  	connectUserRedis,
		getUsedCPU,
		disconnectRedis,
	(req, res) => {
    //res.status(200).send("connect to redis");
    console.log('back end', res.locals.getUsedCPU);
    res.status(200).json(res.locals.getUsedCPU);
  }
);

app.post(
  '/api/testSecurityGroup',
  createSecurityGroup,
  (req: Request, res: Response) => {
    res.status(200).send('Security Group Created');
  }
);

app.post(
  '/api/testSecurityGroupAndEC2Launch',
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
  '/api/testUser', checkUser, async (req, res, next)=>{
		const vpcID	= "vpc-05e65564c244f4fce";
		const amiSecretKey = "cDw/6E5BiFJTzzI7jSBGiMBnsXRbvfiPMzNRCmQZ";
		const amiPublicKey = "cDw/6E5BiFJTzzI7jSBGiMBnsXRbvfiPMzNRCmQZ";
		const region = "us-west-2";
		const ips = [
			'54.214.149.150',
			'35.85.56.71',
			'52.88.71.122',
			'34.211.34.118',
			'54.191.197.151',
			'35.85.34.245'
		]
		


		try{
			await User.findOneAndUpdate({_id: res.locals.user._id},{
				vpcID: vpcID,
				amiPublicKey: amiPublicKey,
				amiSecretKey: amiSecretKey,
				region: region,
				clusterIPs: ips
			}, {new: true});
			const updated = await User.findOne({_id: res.locals.user._id});
			console.log('User updated: ' + updated);
			next();
		}
		catch(err){
			console.error(err);
			res.status(500).send('Internal Server Error');
		}
	}, (req: Request, res: Response) => {console.log('res.locals.user', res.locals.user); res.status(200).json(res.locals.user)});

app.post('/api/testRequestBody', (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).send('Request Body Received');
});

app.get(
  '/api/benchmark',
  verifyCookie,
  runBenchmark,
  (req: Request, res: Response) => {
    console.log('backend', res.locals.benchmark);
    res.status(200).json(res.locals.benchmark);
  }
);

//add connectUserRedis if connect to redis cloud

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle termination signals (i.e,. crtl+c ) when using Docker-Compose
// Without these methods, the termination signal hangs and the container for this app does not gracefully stop.

// process.on('SIGTERM', () => {
//   console.log('SIGTERM signal received: closing HTTP server');
//   redisClient.quit();
//   server.close(() => {
//       console.log('HTTP server closed');
//   });
// });

// process.on('SIGINT', () => {
//   console.log('SIGINT signal received: closing HTTP server');
//   redisClient.quit();
//   server.close(() => {
//       console.log('HTTP server closed');
//   });
// });

//connect to redis cluster
