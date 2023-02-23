package handlers

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/mdkelley02/bootstrapped-blog/internal/store"
	"github.com/sirupsen/logrus"
)

type RouterIF interface {
	Handle(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error)
}

type Router struct {
	log   *logrus.Logger
	store store.StoreIF
}

func NewRouter(log *logrus.Logger, store store.StoreIF) RouterIF {
	return &Router{
		log:   log,
		store: store,
	}
}

func (r *Router) Handle(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	routes := map[string]func(context.Context, events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error){
		ArticleRoute:   r.HandleArticleRequest,
		ArticlesRoute:  r.HandleArticlesRequest,
		HeartbeatRoute: r.HandleHeartbeatRequest,
	}

	r.log.Infof("request: %+v", request)

	if handler, ok := routes[request.Resource]; ok {
		return handler(ctx, request)
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 404,
		Body:       "Not Found",
	}, nil
}
