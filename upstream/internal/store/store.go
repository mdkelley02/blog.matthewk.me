package store

import (
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"strings"
	"sync"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/sirupsen/logrus"
)

type Article struct {
	Id      string `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Date    string `json:"date"`
}

type ArticlePartial struct {
	Id    string `json:"id"`
	Title string `json:"title"`
	Date  string `json:"date"`
}

type StoreIF interface {
	GetArticle(context.Context, string) (*Article, error)
	GetArticles(context.Context) ([]ArticlePartial, error)
}

type S3Store struct {
	bucket string
	client *s3.S3
	log    *logrus.Logger
}

var (
	_                  StoreIF = (*S3Store)(nil)
	ErrArticleNotFound         = errors.New("article not found")
)

func NewS3Store(log *logrus.Logger, s3 *s3.S3, bucket string) *S3Store {
	return &S3Store{
		bucket: bucket,
		client: s3,
		log:    log,
	}
}

func (s *S3Store) GetArticle(
	ctx context.Context,
	id string,
) (*Article, error) {
	et := "S3Store.GetArticle"

	input := &s3.GetObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(id + ".json"),
	}

	output, err := s.client.GetObjectWithContext(ctx, input)
	if err != nil {
		if aerr, ok := err.(awserr.Error); ok {
			switch aerr.Code() {
			case s3.ErrCodeNoSuchKey:
				s.log.Errorf("%s: article not found: %s", et, err)
				return nil, ErrArticleNotFound
			default:
				s.log.Errorf("%s: error getting article: %s", et, err)
				return nil, err
			}
		} else {
			s.log.Errorf("%s: error getting article: %s", et, err)
			return nil, err
		}
	}

	defer output.Body.Close()
	body, err := ioutil.ReadAll(output.Body)
	if err != nil {
		s.log.Errorf("%s: error reading body: %s", et, err)
		return nil, err
	}

	var article Article
	err = json.Unmarshal(body, &article)
	if err != nil {
		s.log.Errorf("%s: error unmarshalling article: %s", et, err)
		return nil, err
	}

	return &article, nil
}

func (s *S3Store) GetArticles(ctx context.Context) ([]ArticlePartial, error) {
	et := "S3Store.GetArticles"
	input := &s3.ListObjectsInput{
		Bucket: aws.String(s.bucket),
	}

	out, err := s.client.ListObjectsWithContext(ctx, input)
	if err != nil {
		s.log.Errorf("%s: error getting articles: %s", et, err)
		return nil, err
	}

	var wg sync.WaitGroup
	ch := make(chan ArticlePartial, len(out.Contents))

	for _, obj := range out.Contents {
		wg.Add(1)
		go func(obj *s3.Object) {
			defer wg.Done()
			key := strings.TrimSuffix(*obj.Key, ".json")
			article, err := s.GetArticle(ctx, key)
			if err != nil {
				s.log.Errorf("%s: error getting article: %s", et, err)
				return
			}

			ch <- ArticlePartial{
				Id:    article.Id,
				Title: article.Title,
				Date:  article.Date,
			}
		}(obj)
	}

	wg.Wait()
	close(ch)

	var articles []ArticlePartial
	for article := range ch {
		articles = append(articles, article)
	}

	return articles, nil
}
