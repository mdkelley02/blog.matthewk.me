data "archive_file" "lambda" {
  type        = "zip"
  source_file = "../dist/app"
  output_path = "../dist/app.zip"
}

data "aws_route53_zone" "cert_zone" {
  name = var.domain_name
}
