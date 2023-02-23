data "archive_file" "lambda" {
  type        = "zip"
  source_file = "../../upstream/dist/app"
  output_path = "../../upstream/dist/app.zip"
}

data "aws_route53_zone" "cert_zone" {
  name = var.domain_name
}
