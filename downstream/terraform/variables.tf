variable "aws_region" {
  type    = string
  default = "us-west-2"
}

variable "alternate_aws_region" {
  type    = string
  default = "us-east-1"
}

# Define variables
variable "bucket_name" {
  type    = string
  default = "blog-bucket"
}

variable "domain_name" {
  type    = string
  default = "matthewk.me"
}
