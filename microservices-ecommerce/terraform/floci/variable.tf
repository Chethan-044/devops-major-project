variable "aws_region" {
  description = "AWS region used by the project"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "ecommerce"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "floci_endpoint" {
  description = "Local Floci endpoint"
  type        = string
  default     = "http://localhost:4566"
}

variable "domain_name" {
  description = "Domain name used by the project"
  type        = string
  default     = "chethnnn.me"
}



//vpc
variable "vpc_cidr" {
  description = "CIDR block for the ecommerce VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones used by the VPC"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

//public subnets
variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}
//private subnets
variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}





//=======================================
//bastion
//=======================================
variable "bastion_instance_type" {
  description = "EC2 instance type for the Bastion Host"
  type        = string
  default     = "t3.medium"
}
variable "bastion_ami_id" {
  description = "AMI ID used by the Bastion Host"
  type        = string
  default     = "ami-0abcdef1234567891"
}

variable "bastion_key_name" {
  description = "EC2 key pair name for Bastion SSH access"
  type        = string
  default     = "ecommerce-bastion-key"
}