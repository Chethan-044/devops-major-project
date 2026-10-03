provider "aws" {
  region = "us-east-1"

  access_key = "test"
  secret_key = "test"

  endpoints {
  route53 = "http://localhost:4566"
  acm     = "http://localhost:4566"
  ec2     = "http://localhost:4566"
}

  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
}