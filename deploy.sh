#!/bin/bash

cd src
# Pack Lambda Functions
arr_variable=("GetInstances" "GetInstanceTypes" "GetInstanceUtilization" "GetUsage" "StoreRegionalUtilization")

## now loop through the above array
for lambda in "${arr_variable[@]}"
do
    cd "lambdas/$lambda"; npm ci; zip ../$lambda.zip *; cd ../..
done


#Validate Stack

aws cloudformation validate-template --template-body file://template.yaml
#Deploy Stack
sam build
sam deploy --stack-name Utilization --resolve-s3 --capabilities CAPABILITY_NAMED_IAM --region us-west-2

# cleanup
for lambda in "${arr_variable[@]}"
do
    rm lambdas/$lambda.zip
done
rm -rf .aws-sam
