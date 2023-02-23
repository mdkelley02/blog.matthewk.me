resource "aws_s3_bucket" "blog_spa_bucket" {
  bucket_prefix = var.bucket_name

  versioning {
    enabled = true
  }

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_public_access_block" "blog_spa_bucket" {
  bucket                  = aws_s3_bucket.blog_spa_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_iam_policy_document" "s3_bucket_policy" {
  statement {
    effect  = "Allow"
    actions = ["s3:GetObject"]
    resources = [
      aws_s3_bucket.blog_spa_bucket.arn,
      "${aws_s3_bucket.blog_spa_bucket.arn}/*"
    ]
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.blog_spa_oai.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "blog_spa_bucket" {
  bucket = aws_s3_bucket.blog_spa_bucket.id
  policy = data.aws_iam_policy_document.s3_bucket_policy.json
}


