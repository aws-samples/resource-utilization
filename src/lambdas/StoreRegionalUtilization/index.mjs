// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch'
const client = new CloudWatchClient()

async function putMetric (region, utilization) {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudwatch/classes/putmetricdatacommand.html
  const command = new PutMetricDataCommand({
    MetricData: [
      {
        MetricName: 'Utilization',
        Dimensions: [
          {
            Name: 'region',
            Value: region
          },
          {
            Name: 'type',
            Value: 'CPU'
          },
          {
            Name: 'service',
            Value: 'EC2'
          }
        ],
        Unit: 'None',
        Value: utilization
      }
    ],
    Namespace: 'Sustainability/KPI'
  })

  await client.send(command)
}

function aggregate (metrics) {
  let totalCpus = 0
  let sum = 0
  for (const metric of metrics) {
    if (metric.utilization) {
      totalCpus += metric.vcpus
      sum += metric.vcpus * metric.utilization
    }
  }
  return { utilization: sum / totalCpus, totalCpus }
}

export const handler = async (event) => {
  console.log(JSON.stringify(event))
  const res = aggregate(event.metrics)
  console.log('utilization: ', res)
  await putMetric(event.region, res.utilization)
  return res
}
