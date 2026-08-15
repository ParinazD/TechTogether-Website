#!/bin/bash
set -e

# Defaults
STACK_NAME="techtogether-site"
BUCKET_NAME="ttg-site-012345"
REGION="us-east-1"
PROFILE=""
TEMPLATE_FILE="$(dirname "$0")/template.yaml"
SITE_DIR="$(dirname "$0")/../site"

usage() {
  echo "Usage: $0 [OPTIONS]"
  echo ""
  echo "Options:"
  echo "  --profile PROFILE   AWS CLI profile to use"
  echo "  --region REGION     AWS region (default: us-east-1)"
  echo "  --bucket NAME       S3 bucket name (default: techtogether-site)"
  echo "  --stack NAME        CloudFormation stack name (default: techtogether-site)"
  echo "  -h, --help          Show this help message"
  exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --profile)
      PROFILE="$2"
      shift 2
      ;;
    --region)
      REGION="$2"
      shift 2
      ;;
    --bucket)
      BUCKET_NAME="$2"
      shift 2
      ;;
    --stack)
      STACK_NAME="$2"
      shift 2
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown option: $1"
      usage
      ;;
  esac
done

# Build AWS CLI flags
AWS_OPTS="--region $REGION"
if [[ -n "$PROFILE" ]]; then
  AWS_OPTS="$AWS_OPTS --profile $PROFILE"
fi

echo "==> Deploying CloudFormation stack: $STACK_NAME"
echo "    Region:  $REGION"
echo "    Bucket:  $BUCKET_NAME"
[[ -n "$PROFILE" ]] && echo "    Profile: $PROFILE"
echo ""

aws cloudformation deploy \
  --template-file "$TEMPLATE_FILE" \
  --stack-name "$STACK_NAME" \
  --parameter-overrides BucketName="$BUCKET_NAME" \
  --no-fail-on-empty-changeset \
  $AWS_OPTS

echo "==> Syncing site files to S3"
aws s3 sync "$SITE_DIR" "s3://$BUCKET_NAME" \
  --delete \
  $AWS_OPTS

# Get CloudFront distribution ID from stack outputs
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" \
  --output text \
  $AWS_OPTS)

echo "==> Invalidating CloudFront cache"
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --no-cli-pager \
  $AWS_OPTS

# Get the CloudFront URL
CF_DOMAIN=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" \
  --output text \
  $AWS_OPTS)

echo ""
echo "==> Done! Site is live at: https://$CF_DOMAIN"
