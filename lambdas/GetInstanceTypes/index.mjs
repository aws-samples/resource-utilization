import {
  EC2Client,
  DescribeInstanceTypesCommand
} from '@aws-sdk/client-ec2'

async function getInstanceTypes (region) {
  const instances = {}
  const params = {}
  const client = new EC2Client({
    region
  })
  let res
  do {
    if (res && res.NextToken) {
      params.NextToken = res.NextToken
    }
    console.log(1)
    const command = new DescribeInstanceTypesCommand(params)
    console.log(2)
    res = await client.send(command)
    console.log(3)
    for (const instance of res.InstanceTypes) {
      instances[instance.InstanceType] = instance.VCpuInfo.DefaultVCpus
    }
  } while (res.NextToken)
  console.log(instances)
  return instances
}

export const handler = async (event) => {
  console.log(event)
  const instancesTypes = await getInstanceTypes(event.region)
  return {
    region: event.region,
    instancesTypes
  }
}
