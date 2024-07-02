import express, { Request, Response } from 'express';   
const bodyParser = require('body-parser');
const { createClient } = require('redis');
const { createFiles } = require('./controllers/fileGenerationController');
const { getEC2Pricing } = require('./controllers/awsPricingController');


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
if (process.env.USE_REDIS === 'true') {
    const redisMaster = createClient({
      url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    });
    
    redisMaster.on('error', (err: Error) => console.error('Redis Master Error:', err));
    
    redisMaster.connect()
        .then(() => console.log(`Redis client connected to ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`))
        .catch((err: Error) => console.error('Redis Master Connection Error:', err));
    
    app.get('/', async (req: Request, res: Response) => {
        try {
            let counter = await redisMaster.get('counter');
            if (!counter) {
                await redisMaster.set('counter', 1);
                counter = 1;
            } else {
                counter = parseInt(counter) + 1;
                await redisMaster.set('counter', counter);
            }
            res.send(counter.toString());
            console.log('counter:', counter);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    });
}

// POST route to handle form submission and write redis.conf file
app.post('/api/createFiles', createFiles, (req : Request, res: Response) => {
    res.status(200).send('Files created successfully');
});


// Post route to handle the fetching of EC2 pricing given inputs from the front end
app.post('/getPricing', getEC2Pricing, (req: Request, res: Response) => {
    res.status(200).json(res.locals.pricingTermsArray);
}); 


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