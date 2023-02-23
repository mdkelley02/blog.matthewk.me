package handlers

import (
	"context"
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"

	"github.com/mdkelley02/bootstrapped-blog/internal/store"
)

const (
	ArticleRoute   = "/articles/{id}"
	ArticlesRoute  = "/articles"
	HeartbeatRoute = "/heartbeat"
)

type ArticleResponse store.Article

type ArticlePartial struct {
	Id    string `json:"id"`
	Title string `json:"title"`
	Date  string `json:"date"`
}

type ArticlesResponse []ArticlePartial

func (r *Router) HandleHeartbeatRequest(
	ctx context.Context,
	request events.APIGatewayProxyRequest,
) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       "OK",
	}, nil
}

func (r *Router) HandleArticlesRequest(
	ctx context.Context,
	request events.APIGatewayProxyRequest,
) (events.APIGatewayProxyResponse, error) {
	articles, err := r.store.GetArticles()
	if err != nil {
		r.log.Errorf("Failed to get articles: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "Internal Server Error",
		}, nil
	}

	response := make(ArticlesResponse, len(articles))
	for i, article := range articles {
		response[i] = ArticlePartial{
			Id:    article.Id,
			Title: article.Title,
			Date:  article.Date,
		}
	}

	body, err := json.Marshal(response)
	if err != nil {
		r.log.Errorf("Failed to marshal response: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "Internal Server Error",
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		Body: string(body),
	}, nil
}

func (r *Router) HandleArticleRequest(
	ctx context.Context,
	request events.APIGatewayProxyRequest,
) (events.APIGatewayProxyResponse, error) {
	id := request.PathParameters["id"]

	article, err := r.store.GetArticle(id)
	if err != nil {
		r.log.Errorf("Failed to get article: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "Internal Server Error",
		}, nil
	}

	if article == nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 404,
			Body:       "Not Found",
		}, nil
	}

	response := ArticleResponse(*article)

	body, err := json.Marshal(response)
	if err != nil {
		r.log.Errorf("Failed to marshal response: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "Internal Server Error",
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		Body: string(body),
	}, nil
}
