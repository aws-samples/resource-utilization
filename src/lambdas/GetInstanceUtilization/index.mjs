// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { CloudWatchClient, GetMetricStatisticsCommand, GetMetricDataCommand } from '@aws-sdk/client-cloudwatch'

const baseline = {
  't1.micro': 10,
  't2.nano': 5,
  't2.micro': 10,
  't2.small': 20,
  't2.medium': 20,
  't2.large': 30,
  't2.xlarge': 22.5,
  't2.2xlarge': 17,
  't3.nano': 5,
  't3.micro': 10,
  't3.small': 20,
  't3.medium': 20,
  't3.large': 30,
  't3.xlarge': 40,
  't3.2xlarge': 40,
  't3a.nano': 5,
  't3a.micro': 10,
  't3a.small': 20,
  't3a.medium': 20,
  't3a.large': 30,
  't3a.xlarge': 40,
  't3a.2xlarge': 40,
  't4g.nano': 5,
  't4g.micro': 10,
  't4g.small': 20,
  't4g.medium': 20,
  't4g.large': 30,
  't4g.xlarge': 40,
  't4g.2xlarge': 40
}

function naiveRound (num, decimalPlaces = 0) {
  const p = Math.pow(10, decimalPlaces)
  return Math.round(num * p) / p
}

async function getInstanceUtilization (event) {
  const client = new CloudWatchClient({ region: event.region })
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)
  let res

  if (event.type.startsWith('t')) {
    // burstable instance type
    const instanceBaseline = baseline[event.type] / 100
    console.log('instanceBaseline', instanceBaseline)

    const params = { // GetMetricDataInput
      MetricDataQueries: [
        {
          Id: 'metric',
          MetricStat: {
            Metric: {
              MetricName: event.MetricName,
              Namespace: event.Namespace,
              Dimensions: [
                {
                  Name: event.DimensionName,
                  Value: event.id
                }
              ]
            },
            Period: 60,
            Stat: 'Average'
          }
        }
      ],
      StartTime: yesterday,
      EndTime: today
    }
    let count = 0
    let sum = 0
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudwatch/classes/getmetricdatacommand.html
    const command = new GetMetricDataCommand(params)
    const response = await client.send(command)
    console.log(JSON.stringify(response))
    for (const res of response.MetricDataResults) {
      count += res.Values.length
      for (const val of res.Values) {
        // consider utilization over baseline as max (100%)
        sum += val > instanceBaseline ? instanceBaseline : val
      }
    }

    res = sum / instanceBaseline / count
    console.log('count', count)
    console.log('sum', sum)
    console.log('avg', res)
  } else {
    const params = {
      StartTime: yesterday,
      EndTime: today,
      MetricName: event.MetricName,
      Namespace: event.Namespace,
      Period: 60 * 60 * 24, // one day
      Statistics: ['Average'],
      Dimensions: [
        {
          Name: event.DimensionName,
          Value: event.id
        }
      ]
    }
    const command = new GetMetricStatisticsCommand(params)
    const stat = await client.send(command)

    if (stat.Datapoints[0]) {
      res = stat.Datapoints[0].Average
    }
  }
  return naiveRound(res, 4)
}

export const handler = async (event) => {
  console.log(event)
  const vcpus = event.instanceTypes[event.type]
  const utilization = await getInstanceUtilization(event)
  const res = { utilization, vcpus }
  return res
}
