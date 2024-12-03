const aws = require("aws-sdk");
import { Request, Response, NextFunction } from "express";

const awsSDKController: {
  [key: string]: (req: Request, res: Response, next: NextFunction) => void;
} = {};

awsSDKController.configureSDK = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { region, publicAccessKey, secretAccessKey } = req.body;

  aws.config.update({
    region: region,
    accessKeyId: publicAccessKey,
    secretAccessKey: secretAccessKey,
  });

  next();
};

awsSDKController.createSecurityGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { vpcID, region, amiPublicKey, amiSecretKey } = req.body;

  const regionObject: Record<string, string> = {
    "US East (N. Virginia)": "us-east-1",
    "US East (Ohio)": "us-east-2",
    "US West (N. California)": "us-west-1",
    "US West (Oregon)": "us-west-2",
    "Canada (Central)": "ca-central-1",
    "Canada West (Calgary)": "ca-central-2",
  };
  const awsRegion = regionObject[region];
  console.log("awsRegion: ", awsRegion);
  console.log("amiPublicKey: ", amiPublicKey);
  console.log("amiSecretKey: ", amiSecretKey);

  aws.config.update({
    region: awsRegion,
    accessKeyId: amiPublicKey,
    secretAccessKey: amiSecretKey,
  });

  const ec2 = new aws.EC2();

  console.log("vpcID: ", vpcID);

  const randomNum = Math.floor(Math.random() * 1000);

  const securityGroupParams: {
    Description: string;
    GroupName: string;
    VpcId: String;
  } = {
    Description: "Security group for Redis Cluster",
    GroupName: `RedisClusterSecurityGroup${randomNum}`,
    VpcId: vpcID,
  };

  try {
    const newSecurityGroup = await ec2
      .createSecurityGroup(securityGroupParams)
      .promise();
    console.log("group id: ", newSecurityGroup.GroupId);
    const groupId: String = newSecurityGroup.GroupId;
    const securityGroupRulesParam = {
      GroupId: groupId,
      IpPermissions: [
        {
          IpProtocol: "tcp",
          FromPort: 6379,
          ToPort: 6379,
          IpRanges: [
            {
              CidrIp: "76.105.195.132/32",
            },
          ],
        },
        {
          IpProtocol: "tcp",
          FromPort: 16379,
          ToPort: 16379,
          IpRanges: [
            {
              CidrIp: "76.105.195.132/32",
            },
          ],
        },
        {
          IpProtocol: "tcp",
          FromPort: 22,
          ToPort: 22,
          IpRanges: [
            {
              CidrIp: "0.0.0.0",
            },
          ],
        },
        {
          IpProtocol: "tcp",
          FromPort: 6379,
          ToPort: 6379,
          IpRanges: [
            {
              CidrIp: "172.31.0.0/16",
            },
          ],
        },
        {
          IpProtocol: "tcp",
          FromPort: 16379,
          ToPort: 16379,
          IpRanges: [
            {
              CidrIp: "172.31.0.0/16",
            },
          ],
        },
      ],
    };

    const newSecurityGroupRules = await ec2
      .authorizeSecurityGroupIngress(securityGroupRulesParam)
      .promise();

    res.locals.securityGroupId = groupId;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

awsSDKController.launchEC2s = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("in launch EC2s");
  const {
    subnetId,
    vpcID,
    region,
    instanceType,
    keyPairName,
    shardsValue,
    replicasValue,
    protectedMode,
    portNumber,
    masterAuth,
    requirePass,
    daemonize,
    loglevel,
    timeout,
    saveSeconds,
    saveChanges,
    appendonly,
    appendfsync,
    rdbcompression,
    rdbchecksum,
    replicaServeStaleData,
    maxmemory,
    maxmemoryPolicy,
    serverType,
  } = req.body;

  for (let key in req.body) {
    if (req.body[key] === true) {
      req.body[key] = "yes";
    } else if (req.body[key] === false) {
      req.body[key] = "no";
    }
  }

  console.log("req.body: ", req.body);
  console.log("rdbcompression: ", rdbcompression);

  // This is the script for when the instances are launched. downloads redis and starts the server
  const redisStartupScript = `#!/bin/bash
sudo yum update
sudo amazon-linux-extras install redis6 -y
cat > redis.conf <<EOF
port 6379
bind 0.0.0.0 
cluster-enabled yes
protected-mode no
cluster-config-file nodes.conf
masterauth ${masterAuth}
requirepass ${masterAuth}
daemonize ${daemonize ? "yes" : "no"} 
loglevel ${loglevel}
timeout ${timeout}
save ${saveSeconds} ${saveChanges}
appendonly ${appendonly ? "yes" : "no"}
appendfsync ${appendfsync}
rdbcompression ${rdbcompression ? "yes" : "no"}
rdbchecksum ${rdbchecksum ? "yes" : "no"}
maxmemory ${maxmemory}
maxmemory-policy ${maxmemoryPolicy}
EOF
redis-server redis.conf`;

  console.log("redisStartupScript: ", redisStartupScript);

  const ec2 = new aws.EC2();

  // These parameters set up the EC2 instancdes to be networked through the security group and subnet
  const ec2Params = {
    ImageId: "ami-0323ead22d6752894",
    InstanceType: serverType,
    KeyName: keyPairName,
    MinCount: shardsValue * (replicasValue + 1),
    MaxCount: shardsValue * (replicasValue + 1),
    UserData: Buffer.from(redisStartupScript).toString("base64"),

    NetworkInterfaces: [
      {
        Groups: [res.locals.securityGroupId],
        DeviceIndex: 0,
        AssociatePublicIpAddress: true,
        SubnetId: subnetId,
      },
    ],
  };
  console.log("ec2Params: ", ec2Params);

  try {
    console.log("launching instances");
    const ec2Data = await ec2.runInstances(ec2Params).promise();
    // gets a list of all the instances crfeated
    const instances = ec2Data.Instances;
    console.log("instances: ", instances);

    //grabs all the instance ids
    const isntanceIds = instances.map((instance: any) => {
      console.log("instance: ", instance.InstanceId);
      return instance.InstanceId;
    });

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    //waits for instances to be ready to be described to get their ips
    await sleep(shardsValue * (replicasValue + 1) * 2000);

    //gets the the details of the instances to grab the IPs
    const IPData = await ec2
      .describeInstances({ InstanceIds: isntanceIds })
      .promise();

    const ips = IPData.Reservations[0].Instances.map((instance: any) => {
      return instance.PublicIpAddress;
    });

    console.log("ips: ", ips);

    const waitForStatuspararms = {
      InstanceIds: isntanceIds,
    };
    console.log("waiting for instances to start");
    //we need to wait for all the instances to be fully running and for the startup commands to download and start
    //redis to be finished, so this waits for the status to be ok on all instances
    await ec2.waitFor("instanceStatusOk", waitForStatuspararms).promise();
    console.log("instances are running");

    let hasReplicas;
    if (replicasValue) {
      hasReplicas = `--cluster-replicas ${replicasValue} `;
    } else hasReplicas = "";

    //Now we are going to start an additional isntance that will actually run the cluster command so the user
    //doesn't have to ssh into an isntance themselves
    const runClusterScript = `
    #!/bin/bash
    sudo yum update
    sudo amazon-linux-extras install redis6 -y
    sleep 5
    echo "yes" | redis-cli --cluster create ${ips
      .map((ip: string, index: number) => `${ip}:6379`)
      .join(" ")} ${hasReplicas}-a ${masterAuth}
    `;
    console.log("runClusterScript: ", runClusterScript);

    const starterEc2Params = {
      ImageId: "ami-0323ead22d6752894",
      InstanceType: serverType,
      KeyName: keyPairName,

      MinCount: 1,
      MaxCount: 1,
      UserData: Buffer.from(runClusterScript).toString("base64"),

      NetworkInterfaces: [
        {
          Groups: [res.locals.securityGroupId],
          DeviceIndex: 0,
          AssociatePublicIpAddress: true,
          SubnetId: subnetId,
        },
      ],
    };

    const starterEc2Data = await ec2.runInstances(starterEc2Params).promise();
    console.log("starter data: ", starterEc2Data);
    const starterInstanceId = starterEc2Data.Instances[0].InstanceId;

    //wait for the script to be run
    await ec2
      .waitFor("instanceStatusOk", { InstanceIds: [starterInstanceId] })
      .promise();

    //since we just needed this node to start the cluster, we can just get rid of it when we're done
    ec2.stopInstances({ InstanceIds: [starterInstanceId] }).promise();

    res.locals.ips = ips;
    console.log("res.locals.ips: ", res.locals.ips);

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = awsSDKController;
