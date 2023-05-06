terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.55.0"
    }
  }
}

locals {
  tags = {
    project    = "blog-spa"
    created_by = "Terraform"
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = local.tags
  }
}

provider "aws" {
  alias  = "us-east-1"
  region = var.alternate_aws_region
  default_tags {
    tags = local.tags
  }
}
