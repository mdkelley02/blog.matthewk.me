resource "aws_s3_bucket" "articles_bucket" {
  bucket_prefix = var.articles_bucket
}

resource "aws_s3_bucket_acl" "articles_bucket_acl" {
  bucket = aws_s3_bucket.articles_bucket.id
  acl    = "private"
}

variable "articles_path" {
  type    = string
  default = "../articles"
}

resource "aws_s3_object" "json_files" {
  for_each = fileset(var.articles_path, "*.json")
  bucket   = aws_s3_bucket.articles_bucket.id
  key      = each.key
  source   = "${var.articles_path}/${each.key}"
  etag     = filemd5("${var.articles_path}/${each.key}")
}

resource "aws_s3_bucket_public_access_block" "articles_bucket" {
  bucket                  = aws_s3_bucket.articles_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}


output "articles_bucket" {
  value = aws_s3_bucket.articles_bucket.id
}

