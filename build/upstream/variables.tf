variable "articles_bucket" {
  type    = string
  default = "blog-articles"
}

variable "aws_region" {
  type    = string
  default = "us-west-2"
}

variable "lambda_bucket" {
  type    = string
  default = "blog-lambda"
}

variable "app_role" {
  type    = string
  default = "blog_lambda"
}

variable "domain_name" {
  type    = string
  default = "matthewk.me"
}

variable "cert_arn" {
  type    = string
  default = "arn:aws:acm:us-east-1:640267202583:certificate/e4fff758-568f-4a87-a342-5dc1d1f6e249"
}
