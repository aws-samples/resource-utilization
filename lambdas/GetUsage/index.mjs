import {
  CostExplorerClient,
  GetCostAndUsageCommand
} from "@aws-sdk/client-cost-explorer";

const client = new CostExplorerClient();
const today = new Date()
const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

const params = {
  Metrics: [
      'USAGE_QUANTITY',
  ],
  Filter: {
      Dimensions: {
          Key: "SERVICE",
          MatchOptions: ["EQUALS"],
          Values: ["Amazon Elastic Compute Cloud - Compute"]
      }
  },
  TimePeriod: {
      End: today.toISOString().split('T')[0],
      Start: yesterday.toISOString().split('T')[0]
  },
  Granularity: 'DAILY',
  GroupBy: [{
      Key: 'REGION',
      Type: 'DIMENSION'
  }]
};

export const handler = async (event) => {
  const command = new GetCostAndUsageCommand(params);
  const res = await client.send(command);
  const regions = new Set()
  for (const result of res.ResultsByTime) {
      for (const group of result.Groups) {
          for (const key of group.Keys) {
              regions.add(key)
          }
      }
  }
  console.log([...regions])
  return [...regions];
};