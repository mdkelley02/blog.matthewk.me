package store

import (
	"encoding/json"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/sirupsen/logrus"
)

type Article struct {
	Id      string `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Date    string `json:"date"`
}

type StoreIF interface {
	GetArticle(id string) (*Article, error)
	GetArticles() ([]Article, error)
}

type S3Store struct {
	Bucket string
	S3     *s3.S3
	Log    *logrus.Logger
}

func NewS3Store(log *logrus.Logger, s3 *s3.S3, bucket string) *S3Store {
	return &S3Store{
		Bucket: bucket,
		S3:     s3,
		Log:    log,
	}
}

func (s *S3Store) GetArticle(id string) (*Article, error) {
	articles, err := s.GetArticles()
	if err != nil {
		return nil, err
	}

	for _, article := range articles {
		if article.Id == id {
			return &article, nil
		}
	}

	return nil, nil
}

func (s *S3Store) GetArticles() ([]Article, error) {
	et := "S3Store.GetArticles"

	resp, err := s.S3.ListObjects(&s3.ListObjectsInput{
		Bucket: aws.String(s.Bucket),
	})
	if err != nil {
		s.Log.Errorf("%s: error getting articles: %s", et, err)
		return nil, err
	}

	articles := []Article{}
	for _, obj := range resp.Contents {
		s.Log.Infof("%s: getting article: %s", et, *obj.Key)
		resp, err := s.S3.GetObject(&s3.GetObjectInput{
			Bucket: aws.String(s.Bucket),
			Key:    obj.Key,
		})
		if err != nil {
			s.Log.Errorf("%s: error getting article: %s", et, err)
			return nil, err
		}

		article := Article{}
		json.NewDecoder(resp.Body).Decode(&article)
		articles = append(articles, article)
	}

	return articles, nil
}
