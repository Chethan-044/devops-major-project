resource "aws_route53_zone" "ecommerce" {
  name = var.domain_name

  tags = {
    Name        = "${var.project_name}-zone"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}




// ACM Validation Record
resource "aws_route53_record" "acm_validation" {
  zone_id = aws_route53_zone.ecommerce.zone_id

  name = tolist(
    aws_acm_certificate.ecommerce.domain_validation_options
  )[0].resource_record_name

  type = tolist(
    aws_acm_certificate.ecommerce.domain_validation_options
  )[0].resource_record_type

  records = [
    tolist(
      aws_acm_certificate.ecommerce.domain_validation_options
    )[0].resource_record_value
  ]

  ttl = 60
}