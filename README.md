## Resource Utilization

This is just the first and most simple version of an account wide resource utilization metric & dashboard, to get overall insights on actually how much room for optimization is available.

Initial version considers only Amazon EC2 service CPU Utilization, to establish a baseline.

## Requirements
* AWS credentials setup in your environment: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
* AWS SAM CLI Installation: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

## Deployment

Execute `deploy.sh` to pack and deploy the `template.yaml` AWS CloudFormation template:

`./deploy.sh`

## Usage

The provided template includes an AWS Step Function that orchestrates the whole metric gathering and aggregation process and, the step function is triggered daily via an Amazon EventBridge rule, so no manual intervention is needed to process the data.

Statistical data is stored as per region Amazon CloudWatch metrics and is displayed in a Amazon CloudWatch Dashboard available for your analysis.

![Sample Dashboard](assets/dashboard-screenshot.png)

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

