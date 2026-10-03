resource "aws_acm_certificate" "ecommerce" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  tags = {
    Name        = "${var.project_name}-certificate"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}