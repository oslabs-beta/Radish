const aws = require('aws-sdk');
require('dotenv').config();

// Set AWS credentials and region from environment variables. 
//For this to work properly, you will need an AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in a .env file located in the project root.

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'defaultKeyId',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'defaultSecretKey',
  region: 'us-east-1' // Default region for Pricing API
});


const awsPricingController = {};

awsPricingController.getEC2Pricing = async (req, res, next) => {
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
      res.locals.pricingTermsArray = pricingTermsArray;
      next();

  } catch (err) {
      console.error('Error fetching EC2 pricing:', err);
      // res.status(500).send('An error occurred while fetching EC2 pricing');
      next(err);
  }
};

module.exports = awsPricingController;