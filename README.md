## Resource Utilization

This is just the first and most simple version of an account wide resource utilization metric & dashboard, to get overall 
insights on actually how much room for optimization is available.

As a baseline, initial version considers only [Amazon EC2](https://aws.amazon.com/ec2/) service [CPU Utilization](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring_ec2.html).

## Requirements
* Install Node Package Manager / NPM: [instructions here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* Setup AWS credentials for your environment: [instructions here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
* Install AWS SAM CLI: [instructions here](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

## Architecture

![Architecture Diagram](assets/resource-utilization.drawio.png)

## Deployment

Inside your terminal, execute `deploy.sh` to pack and deploy the `template.yaml` [AWS CloudFormation](https://aws.amazon.com/cloudformation/) template:

`./deploy.sh`

## Usage

This template includes an [AWS Step Function](https://aws.amazon.com/step-functions/) that orchestrates the whole metric gathering and aggregation process.
It is triggered daily via an [Amazon EventBridge](https://aws.amazon.com/eventbridge/) rule, so that no manual intervention is needed to process the data.

Statistical data is stored per region as [Amazon CloudWatch metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html) and displayed in an [Amazon CloudWatch Dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html) 
available for your analysis.

![Sample Dashboard](assets/dashboard-screenshot.png)

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) document for more information.

## License

This library is licensed under the MIT-0 License. See [LICENSE](LICENSE) file.

