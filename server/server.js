const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path'); 
const { createClient } = require('redis');
const yaml = require('js-yaml');
const aws = require('aws-sdk');

const app = express();
const port = 80;

// Load .env variables
require('dotenv').config();

// Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

console.log('Connect to Redis?', process.env.USE_REDIS);
console.log('Redis Password:', process.env.REDIS_PASSWORD);

// Set AWS credentials and region from environment variables. 
//For this to work properly, you will need an AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in a .env file located in the project root.

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'defaultKeyId',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'defaultSecretKey',
    region: 'us-east-1' // Default region for Pricing API
});

// Connect to redis cluster when the docker-compose file tells us to do so
if (process.env.USE_REDIS === 'true') {
    const redisMaster = createClient({
      url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    });
    
    redisMaster.on('error', err => console.error('Redis Master Error:', err));
    
    redisMaster.connect()
        .then(() => console.log(`Redis client connected to ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`))
        .catch(err => console.error('Redis Master Connection Error:', err));
    
    app.get('/', async (req, res) => {
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
app.post('/createFiles', (req, res) => {
  console.log(req.body);
  // Destructure form data on req.body
  let { numShards, numReplicas, protectedMode, portNumber, masterAuth, requirePass } = req.body;

  // Construct the output directory path
  const outputDir = path.join(__dirname, 'output');

  // Determine number of redis.conf files to write and initialize file counter
  let redisFilesToWrite = numShards * numReplicas;
  let redisFilesWritten = 0;

  let port = Number(portNumber);

  let dockerCompose = {
      version: '3.8',
      services: {},
      volumes: {}
  };
  dockerCompose.services['app'] = {
      image: 'client-app-js:latest',
      container_name: 'client-app-js',
      ports: ['80:80'],
      environment: ['REDIS_HOST=Redis-0-0',`REDIS_PORT=${portNumber}`, `REDIS_PASSWORD=${masterAuth}`, 'USE_REDIS=true' ],
      command: ['sh', '-c', 'sleep 10 && npm start']
  }
  
  for (let i = 0; i < numShards; i++) {
    for (let j = 0; j < numReplicas; j++) {
      let serviceName = `redis-${i}-${j}`;
      let masterServiceName = `redis-${i}-0`;
      
      // Construct the content for redis.conf
      let redisConfigContent = `protected-mode ${protectedMode}\nport ${port}\n`;

      // The first config file is for a master node and does not have the replicaof property
      if (j !== 0) redisConfigContent += `replicaof ${masterServiceName} ${port - j}\n`;

      redisConfigContent += `# Authentication\nmasterauth ${masterAuth}\nrequirepass ${requirePass}\n`;

      // Write each redis configuration file to the output folder
      let outputFile = path.join(outputDir, `redis-${i}-${j}.conf`);
      fs.writeFile(outputFile, redisConfigContent, (err) => {
          if (err) {
              console.error('Error writing redis.conf file(s):', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }
          redisFilesWritten++;
          // Check if the required number of files have been written before responding to the client
          if (redisFilesWritten === redisFilesToWrite) {
              // Write the require docker-compose.yml file
              const dockerComposeFile = path.join(outputDir, 'docker-compose.yml');
              fs.writeFile(dockerComposeFile, yaml.dump(dockerCompose), (err) => {
                  if (err) {
                      console.error('Error writing docker-compose.yml file:', err);
                  }
                  res.status(200).json({ message: `All configuration files written successfully to path: ${outputDir}` });
              });
          }
        });

        // Define volume(s) to ensure data persistence after docker containers are stopped and removed.
        let volumeName = `redis-${i}-${j}-data`;

        // Add each redis instance to the docker-compose configuration
        dockerCompose.services[`redis-${i}-${j}`] = {
            image: 'redis:latest',
            container_name: serviceName,
            volumes: [
                `./redis-${i}-${j}.conf:/usr/local/etc/redis/redis.conf`,
                `${volumeName}:/data`
            ],
            command: `redis-server /usr/local/etc/redis/redis.conf`,
            ports: [`${port}:${port - j}`]
        };

        // Add volume to the volumes section of the docker-compose file
        dockerCompose.volumes[volumeName] = {};

        // Increment port number as each Redis instance will run on a different port
        port++;
      }
    }
  });

// Post route to handle the fetching of EC2 pricing given inputs from the front end
app.post('/getPricing', async (req, res) => {
    const { region, instanceType, operatingSystem, instanceCount } = req.body;
 
    if (!region || !instanceType || !instanceCount) {
        return res.status(400).send('Must select an AWS EC2 instance type, quantity, and region from drop down menu');
    }
 
    // Helper function to get region name
    function getRegionName(regionCode) {
        const regions = {
        'us-east-1': 'US East (N. Virginia)',
        'us-west-1': 'US West (N. California)',
        'us-west-2': 'US West (Oregon)',
        };
        return regions[regionCode] || null;
    }
 
    try {
        // create a new pricing service object
        const pricing = new aws.Pricing({ region: 'us-east-1' });
 
        //const operatingSystem = ["Linux", "SUSE", "Red Hat Enterprise Linux with HA", ]
        const params = {
            ServiceCode: 'AmazonEC2',
            Filters: [
                { Type: 'TERM_MATCH', Field: 'instanceType', Value: instanceType },
                { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Compute Instance' },
                { Type: 'TERM_MATCH', Field: 'location', Value: getRegionName(region) },
                { Type: 'TERM_MATCH', Field: 'preInstalledSw', Value: 'NA' },
                // { Type: 'TERM_MATCH', Field: 'operatingSystem', Value: operatingSystem }
            ]
        };
 
        const data = await pricing.getProducts(params).promise();
        // Uncomment the following line if you want to see the raw response from AWS Pricing API.
        // return res.json(data);
 
        const priceList = data.PriceList;
        console.log('Number of products:', priceList.length)
 
        const pricingTermsArray = [];
        let idCounter = 1;
 
        priceList.forEach((product, index) => {
            // const operatingSystem = product.attributes.operatingSystem;
            const terms = product.terms;
            const AVERAGE_MONTHLY_HOURS = 730; // Average hours in a month
 
            // Process OnDemand pricing
            if (terms.OnDemand) {
                for (const termKey in terms.OnDemand) {
                    const term = terms.OnDemand[termKey];
                    for (const priceDimensionKey in term.priceDimensions) {
                        const priceDimension = term.priceDimensions[priceDimensionKey];
                        const pricePerUnit = parseFloat(priceDimension.pricePerUnit.USD);
 
                        pricingTermsArray.push({
                            id: idCounter++,
                            description: priceDimension.description,
                            paymentTerms: 'OnDemand',
                            purchaseOption: 'N/A', // OnDemand instances typically do not have purchase options
                            pricePerUnit: pricePerUnit,
                            unit: priceDimension.unit,
                            leaseContractLength: 'N/A', // OnDemand instances do not have lease contracts
                            upfrontFee: 'N/A', // OnDemand instances do not have upfront fees
                            monthlyTotalPrice: pricePerUnit * AVERAGE_MONTHLY_HOURS // Monthly total price for OnDemand
                        });
                    }
                }
            }
 
            // Process Reserved Instance pricing
            if (terms.Reserved) {
                for (const termKey in terms.Reserved) {
                    const term = terms.Reserved[termKey];
                    const leaseContractLength = term.termAttributes.LeaseContractLength || 'N/A';
                    const purchaseOption = term.termAttributes.PurchaseOption || 'N/A';
 
                    if (purchaseOption === 'Partial Upfront') {
                        // Skip Partial Upfront options
                        continue;
                    }
 
                    let leaseMonths = 1;
                    if (leaseContractLength === '1yr') {
                        leaseMonths = 12;
                    } else if (leaseContractLength === '3yr') {
                        leaseMonths = 36;
                    }
 
                    for (const priceDimensionKey in term.priceDimensions) {
                        const priceDimension = term.priceDimensions[priceDimensionKey];
                        const pricePerUnit = parseFloat(priceDimension.pricePerUnit.USD);
 
                        // Calculate monthly total price for Reserved instances
                        let monthlyTotalPrice = 0;
                        if (priceDimension.description.includes('Upfront Fee')) {
                            monthlyTotalPrice += pricePerUnit / leaseMonths; // Distribute upfront fee over the lease months
                        } else {
                            monthlyTotalPrice += pricePerUnit * AVERAGE_MONTHLY_HOURS;
                        }
 
                        pricingTermsArray.push({
                            id: idCounter++,
                            paymentTerms: 'Reserved',
                            description: priceDimension.description,
                            purchaseOption: purchaseOption,
                            pricePerUnit: priceDimension.description.includes('Upfront Fee') ? 'N/A' : pricePerUnit,
                            unit: priceDimension.unit,
                            leaseContractLength: leaseContractLength,
                            upfrontFee: priceDimension.description.includes('Upfront Fee') ? pricePerUnit : 'N/A',
                            monthlyTotalPrice: monthlyTotalPrice
                        });
                    }
                }
            }
        })
 
        // console.log(pricingTermsArray);
        res.json(pricingTermsArray);
 
    } catch (err) {
        console.error('Error fetching EC2 pricing:', err);
        res.status(500).send('An error occurred while fetching EC2 pricing');
    }
 }); 

app.post('/test/createFiles', (req, res) => {
  console.log('Received POST request to /test/createFiles');
  console.log('Request body:', req.body);
  // res.status(200).send('Received POST request to /test/createFiles');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Handle termination signals (i.e,. crtl+c ) when using Docker-Compose
// Without these methods, the termination signal hangs and the container for this app does not gracefully stop.
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  redisClient.quit();
  server.close(() => {
      console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  redisClient.quit();
  server.close(() => {
      console.log('HTTP server closed');
  });
});