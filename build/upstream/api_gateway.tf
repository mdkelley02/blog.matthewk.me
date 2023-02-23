resource "aws_api_gateway_rest_api" "blog_api" {
  name = "blog_api"
}

# Resources
resource "aws_api_gateway_resource" "articles" {
  parent_id   = aws_api_gateway_rest_api.blog_api.root_resource_id
  path_part   = "articles"
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
}
resource "aws_api_gateway_resource" "article" {
  parent_id   = aws_api_gateway_resource.articles.id
  path_part   = "{id}"
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
}

# Methods
resource "aws_api_gateway_method" "articles-GET" {
  authorization = "NONE"
  http_method   = "GET"
  resource_id   = aws_api_gateway_resource.articles.id
  rest_api_id   = aws_api_gateway_rest_api.blog_api.id
}
resource "aws_api_gateway_method" "articles-OPTIONS" {
  authorization = "NONE"
  http_method   = "OPTIONS"
  resource_id   = aws_api_gateway_resource.articles.id
  rest_api_id   = aws_api_gateway_rest_api.blog_api.id
}
resource "aws_api_gateway_method_response" "articles-method-response-OPTIONS" {
  http_method = aws_api_gateway_method.articles-OPTIONS.http_method
  resource_id = aws_api_gateway_resource.articles.id
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_method" "article-GET" {
  authorization = "NONE"
  http_method   = "GET"

  request_parameters = {
    "method.request.path.id" = "true"
  }

  resource_id = aws_api_gateway_resource.article.id
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
}
resource "aws_api_gateway_method" "article-OPTIONS" {
  authorization = "NONE"
  http_method   = "OPTIONS"
  resource_id   = aws_api_gateway_resource.article.id
  rest_api_id   = aws_api_gateway_rest_api.blog_api.id
}
resource "aws_api_gateway_method_response" "article-method-response-OPTIONS" {
  http_method = aws_api_gateway_method.article-OPTIONS.http_method
  resource_id = aws_api_gateway_resource.article.id
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

# Integrations
resource "aws_api_gateway_integration" "articles-integration-GET" {
  connection_type         = "INTERNET"
  http_method             = aws_api_gateway_method.articles-GET.http_method
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  resource_id             = aws_api_gateway_resource.articles.id
  rest_api_id             = aws_api_gateway_rest_api.blog_api.id
  timeout_milliseconds    = "29000"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.blog_lambda.invoke_arn
}
resource "aws_api_gateway_integration" "articles-integration-OPTIONS" {
  connection_type      = "INTERNET"
  http_method          = "OPTIONS"
  passthrough_behavior = "WHEN_NO_MATCH"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }

  resource_id          = aws_api_gateway_resource.articles.id
  rest_api_id          = aws_api_gateway_rest_api.blog_api.id
  timeout_milliseconds = "29000"
  type                 = "MOCK"
}
resource "aws_api_gateway_integration_response" "articles-integration-response-OPTIONS" {
  http_method = aws_api_gateway_method.articles-OPTIONS.http_method
  resource_id = aws_api_gateway_resource.articles.id
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}


resource "aws_api_gateway_integration" "article-integration-GET" {
  connection_type         = "INTERNET"
  content_handling        = "CONVERT_TO_TEXT"
  http_method             = aws_api_gateway_method.article-GET.http_method
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_MATCH"
  resource_id             = aws_api_gateway_resource.article.id
  rest_api_id             = aws_api_gateway_rest_api.blog_api.id
  timeout_milliseconds    = "29000"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.blog_lambda.invoke_arn
}
resource "aws_api_gateway_integration" "article-integration-OPTIONS" {
  connection_type      = "INTERNET"
  http_method          = "OPTIONS"
  passthrough_behavior = "WHEN_NO_MATCH"
  resource_id          = aws_api_gateway_resource.article.id
  rest_api_id          = aws_api_gateway_rest_api.blog_api.id
  timeout_milliseconds = "29000"
  type                 = "MOCK"
}
resource "aws_api_gateway_integration_response" "article-integration-response-OPTIONS" {
  http_method = aws_api_gateway_method.article-OPTIONS.http_method
  resource_id = aws_api_gateway_resource.article.id
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

# Deployment
resource "aws_api_gateway_deployment" "blog_api" {
  rest_api_id = aws_api_gateway_rest_api.blog_api.id
  triggers = {
    redeployment = sha1(join(",", [
      aws_api_gateway_method.articles-GET.id,
      aws_api_gateway_method.articles-OPTIONS.id,
      aws_api_gateway_method.article-GET.id,
      aws_api_gateway_method.article-OPTIONS.id,
    ]))
  }
}

# Stage
resource "aws_api_gateway_stage" "blog_api" {
  deployment_id = aws_api_gateway_deployment.blog_api.id
  rest_api_id   = aws_api_gateway_rest_api.blog_api.id
  stage_name    = "api"
}

# Permissions
resource "aws_lambda_permission" "lambda_permission" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.blog_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.blog_api.execution_arn}/*/*/*"
}






