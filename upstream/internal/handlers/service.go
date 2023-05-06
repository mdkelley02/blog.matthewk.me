package handlers

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/mdkelley02/blog.matthewk.me/internal/store"
	"github.com/sirupsen/logrus"
)

type RouterIF interface {
	Handle(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error)
}

var _ RouterIF = (*Handler)(nil)

type Handler struct {
	log    *logrus.Logger
	store  store.StoreIF
	routes map[string]func(context.Context, events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error)
}

func NewRouter(
	log *logrus.Logger,
	store store.StoreIF,
) RouterIF {
	r := &Handler{
		log:   log,
		store: store,
	}
	r.routes = map[string]func(context.Context, events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error){
		"/articles/{id}": r.handleGetArticle,
		"/articles":      r.handleGetArticles,
		"/heartbeat":     r.handleHeartbeat,
	}
	return r
}

func (r *Handler) Handle(
	ctx context.Context,
	request events.APIGatewayProxyRequest,
) (events.APIGatewayProxyResponse, error) {
	if handler, ok := r.routes[request.Resource]; ok {
		r.log.Infof("request: %+v", request)
		return handler(ctx, request)
	}

	r.log.Warnf("no route found for request: %+v", request)
	return events.APIGatewayProxyResponse{
		StatusCode: 404,
		Body:       "Not Found",
	}, nil
}
