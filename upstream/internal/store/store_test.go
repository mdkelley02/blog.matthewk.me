package store

import (
	"context"
	"testing"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/kelseyhightower/envconfig"
	"github.com/mdkelley02/blog.matthewk.me/configs"
	"github.com/sirupsen/logrus"
)

func StoreFixture(t *testing.T) StoreIF {
	log := logrus.New()
	settings := &configs.Settings{
		AWS_REGION:  "us-west-2",
		BUCKET_NAME: "blog-articles20230220064948628800000001",
	}
	err := envconfig.Process("", settings)
	if err != nil {
		log.Fatalf("Error loading settings: %s", err.Error())
		panic(err)
	}

	sess := session.Must(session.NewSession(
		&aws.Config{Region: aws.String(settings.AWS_REGION)},
	))

	s3 := s3.New(sess)

	return NewS3Store(log, s3, settings.BUCKET_NAME)
}

func Test_GetArticles(t *testing.T) {
	ctx := context.Background()
	store := StoreFixture(t)
	articles, err := store.GetArticles(ctx)
	if err != nil {
		t.Fatalf("Error getting articles: %s", err.Error())
	}

	t.Logf("Articles: %v", articles)

	if len(articles) == 0 {
		t.Fatalf("No articles returned")
	}

	for _, article := range articles {
		t.Logf("Article: %v", article)
	}
}

func Test_GetArticle(t *testing.T) {
	ctx := context.Background()
	store := StoreFixture(t)
	articles, err := store.GetArticles(ctx)
	if err != nil {
		t.Fatalf("Error getting articles: %s", err.Error())
	}

	if len(articles) == 0 {
		t.Fatalf("No articles returned")
	}

	for _, article := range articles {
		article, err := store.GetArticle(ctx, article.Id)
		if err != nil {
			t.Fatalf("Error getting article: %s", err.Error())
		}

		t.Logf("Article: %v", article)
	}
}
