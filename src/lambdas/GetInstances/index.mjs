// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import {
  EC2Client,
  DescribeInstancesCommand
} from '@aws-sdk/client-ec2'

async function getInstances (region) {
  const instances = []
  const client = new EC2Client({
    region
  })
  const params = {}
  const command = new DescribeInstancesCommand(params)
  const res = await client.send(command)
  console.log('res: ', res)
  for (const reserve of res.Reservations) {
    for (const instance of reserve.Instances) {
      console.log(instance.InstanceId, instance.InstanceType)
      instances.push({ id: instance.InstanceId, type: instance.InstanceType })
    }
  }
  return instances
}
export const handler = async (event) => {
  console.log(event)
  const instances = await getInstances(event.region)
  return { region: event.region, instanceTypes: event.instancesTypes, instances }
}
