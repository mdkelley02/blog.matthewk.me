resource "aws_lambda_function" "blog_lambda" {
  function_name    = var.app_role
  handler          = "app"
  runtime          = "go1.x"
  role             = aws_iam_role.lambda_execution_role.arn
  source_code_hash = filebase64sha256(data.archive_file.lambda.output_path)
  filename         = data.archive_file.lambda.output_path
  # Set environment variables if necessary
  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.articles_bucket.id
    }
  }
}

resource "aws_iam_role" "lambda_execution_role" {
  name = "lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# policy allowing the lambda function to read from the articles bucket
resource "aws_iam_policy" "blog_lambda_s3_read" {
  name = "blog_lambda_s3_read"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          "${aws_s3_bucket.articles_bucket.arn}",
          "${aws_s3_bucket.articles_bucket.arn}/*",
        ]
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "basic_execution_role" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "blog_lambda_s3_read" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.blog_lambda_s3_read.arn
}
