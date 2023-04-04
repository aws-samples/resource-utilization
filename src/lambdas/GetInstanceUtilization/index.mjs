// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { CloudWatchClient, GetMetricStatisticsCommand } from '@aws-sdk/client-cloudwatch'

function naiveRound (num, decimalPlaces = 0) {
  const p = Math.pow(10, decimalPlaces)
  return Math.round(num * p) / p
}

async function getInstanceUtilization (id, region, Namespace, MetricName, DimensionName) {
  const client = new CloudWatchClient({ region })
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  const params = {
    StartTime: yesterday,
    EndTime: today,
    MetricName,
    Namespace,
    Period: 60 * 60 * 24, // one day
    Statistics: ['Average'],
    Dimensions: [
      {
        Name: DimensionName,
        Value: id
      }
    ]
  }
  const command = new GetMetricStatisticsCommand(params)
  const stat = await client.send(command)

  let res
  if (stat.Datapoints[0]) {
    res = stat.Datapoints[0].Average
  }
  return naiveRound(res, 4)
}

export const handler = async (event) => {
  console.log(event)
  const vcpus = event.instanceTypes[event.type]
  const utilization = await getInstanceUtilization(event.id, event.region, event.Namespace, event.MetricName, event.DimensionName)
  const res = { utilization, vcpus }
  return res
}
