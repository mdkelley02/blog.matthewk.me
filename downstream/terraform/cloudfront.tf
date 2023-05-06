data "aws_route53_zone" "zone" {
  name = var.domain_name
}

resource "aws_cloudfront_distribution" "blog_spa_distribution" {
  enabled = true
  aliases = [
    "blog.${var.domain_name}"
  ]
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.blog_spa_bucket.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.blog_spa_bucket.SX

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.blog_spa_oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    target_origin_id       = aws_s3_bucket.blog_spa_bucket.bucket_regional_domain_name
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      headers      = []
      cookies {
        forward = "all"
      }
    }
  }

  custom_error_response {
    error_caching_min_ttl = 1
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.blog_spa.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2019"
  }
}

resource "aws_cloudfront_origin_access_identity" "blog_spa_oai" {
  comment = "Blog SPA OAI"
}

resource "aws_acm_certificate" "blog_spa" {
  provider          = aws.us-east-1
  domain_name       = var.domain_name
  validation_method = "DNS"
  subject_alternative_names = [
    "blog.${var.domain_name}"
  ]
}

resource "aws_route53_record" "blog_spa_validation" {
  for_each = {
    for d in aws_acm_certificate.blog_spa.domain_validation_options : d.domain_name => {
      name   = d.resource_record_name
      type   = d.resource_record_type
      record = d.resource_record_value
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.zone.zone_id
}

resource "aws_acm_certificate_validation" "certvalidation" {
  provider                = aws.us-east-1
  certificate_arn         = aws_acm_certificate.blog_spa.arn
  validation_record_fqdns = [for r in aws_route53_record.blog_spa_validation : r.fqdn]
}

resource "aws_route53_record" "blog_spa" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name    = "blog.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.blog_spa_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.blog_spa_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
