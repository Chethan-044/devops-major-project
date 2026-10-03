output "route53_zone_id" {
  description = "Route 53 hosted zone ID"
  value       = aws_route53_zone.ecommerce.zone_id
}

output "route53_zone_name" {
  description = "Route 53 hosted zone name"
  value       = aws_route53_zone.ecommerce.name
}

output "route53_name_servers" {
  description = "Route 53 name servers"
  value       = aws_route53_zone.ecommerce.name_servers
}


//vpc
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.ecommerce.id
}
output "vpc_cidr" {
  description = "VPC CIDR block"
  value       = aws_vpc.ecommerce.cidr_block
}
output "subnet_public_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}
output "subnet_private_ids" {
  description = "Private subnet IDs"
  value       = aws_subnet.private[*].id
}
output "nat_gateway_id" {
  description = "NAT Gateway ID"
  value       = aws_nat_gateway.ecommerce.id
}

//bastion host
output "bastion_instance_id" {
  description = "Bastion EC2 instance ID"
  value       = aws_instance.bastion.id
}

output "bastion_public_ip" {
  description = "Bastion public IP address"
  value       = aws_instance.bastion.public_ip
}

output "bastion_private_ip" {
  description = "Bastion private IP address"
  value       = aws_instance.bastion.private_ip
}