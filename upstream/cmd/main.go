package main

import (
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/kelseyhightower/envconfig"
	"github.com/mdkelley02/bootstrapped-blog/configs"
	"github.com/mdkelley02/bootstrapped-blog/internal/handlers"
	"github.com/mdkelley02/bootstrapped-blog/internal/store"
	"github.com/sirupsen/logrus"
)

var (
	log      = logrus.New()
	settings = &configs.Settings{}
)

func main() {
	err := envconfig.Process("", settings)
	if err != nil {
		log.Fatalf("Error loading settings: %s", err.Error())
		panic(err)
	}

	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String(settings.AWS_REGION),
	}))

	store := store.NewS3Store(log, s3.New(sess), settings.BUCKET_NAME)
	router := handlers.NewRouter(log, store)

	lambda.Start(router.Handle)
}
