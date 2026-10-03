resource "aws_security_group" "bastion" {
  name        = "${var.project_name}-bastion-sg"
  description = "Security group for the Bastion Host"
  vpc_id      = aws_vpc.ecommerce.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-bastion-sg"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

//bastion host
resource "aws_instance" "bastion" {
  ami           = var.bastion_ami_id
  instance_type = var.bastion_instance_type

  subnet_id = aws_subnet.public[0].id

  key_name = var.bastion_key_name

  vpc_security_group_ids = [
    aws_security_group.bastion.id
  ]

  associate_public_ip_address = true

  user_data = <<-EOF
    #!/bin/bash

    dnf install -y openssh-server

    ssh-keygen -A

    mkdir -p /run/sshd

    /usr/sbin/sshd -D &
  EOF

  tags = {
    Name        = "${var.project_name}-bastion"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Role        = "bastion"
  }
}