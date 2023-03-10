// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

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
    const command = new DescribeInstanceTypesCommand(params)
    res = await client.send(command)
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
