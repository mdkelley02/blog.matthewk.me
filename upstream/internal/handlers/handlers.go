package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/sirupsen/logrus"

	"github.com/mdkelley02/blog.matthewk.me/internal/store"
)

type ArticleResponse store.Article

type ArticlePartial struct {
	Id    string `json:"id"`
	Title string `json:"title"`
	Date  string `json:"date"`
}

type ArticlesResponse []ArticlePartial

func (r *Handler) handleHeartbeat(
	ctx context.Context,
	request events.APIGatewayProxyRequest,
) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       "OK",
	}, nil
}

func makeResponse(
	statusCode int,
	body string,
) events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		Body: body,
	}
}

func (r *Handler) handleGetArticles(
	ctx context.Context,
	request events.APIGatewayProxyRequest,
) (events.APIGatewayProxyResponse, error) {
	articles, err := r.store.GetArticles(ctx)
	if err != nil {
		r.log.Errorf("Failed to get articles: %v", err)
		return events.APIGatewayProxyResponse{}, err
	}

	jsonData, err := json.Marshal(articles)
	if err != nil {
		r.log.Errorf("Failed to marshal articles JSON: %v", err)
		return events.APIGatewayProxyResponse{}, err
	}

	return makeResponse(http.StatusOK, string(jsonData)), nil
}

func (r *Handler) handleGetArticle(
	ctx context.Context,
	request events.APIGatewayProxyRequest,
) (events.APIGatewayProxyResponse, error) {
	article, err := r.store.GetArticle(ctx, request.PathParameters["id"])
	if err != nil {
		statusCode := http.StatusInternalServerError
		if errors.Is(err, store.ErrArticleNotFound) {
			statusCode = http.StatusNotFound
		} else {
			logrus.Errorf("Failed to get article: %v", err)
		}
		return makeResponse(statusCode, ""), err
	}

	jsonData, err := json.Marshal(article)
	if err != nil {
		r.log.Errorf("Failed to marshal article JSON: %v", err)
		return events.APIGatewayProxyResponse{}, err
	}

	return makeResponse(http.StatusOK, string(jsonData)), nil
}
