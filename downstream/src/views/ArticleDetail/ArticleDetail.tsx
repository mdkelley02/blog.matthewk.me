import { useState, useEffect } from "react";
import { useParams, RouteObject } from "react-router-dom";
import { Article, useArticles } from "../../hooks/useArticles";
import Layout from "../../components/Layout/Layout";
import { FaClock } from "react-icons/fa";
import { AiFillCalendar } from "react-icons/ai";
import Markdown from "../../components/Markdown/Markdown";
import Skeleton from "react-loading-skeleton";
import "./ArticleDetail.scss";

export const ArticleDetailRoute: RouteObject = {
  path: "/articles/:articleId",
  element: <ArticleDetail />,
};

type ArticleDetailParams = {
  articleId: string;
};

function ArticleDetail() {
  const [article, setArticle] = useState<Article | null>(null);
  const { articleId } = useParams<ArticleDetailParams>();
  const { getArticle } = useArticles();

  useEffect(() => {
    async function fetchArticle() {
      setArticle(await getArticle(articleId ?? ""));
    }
    fetchArticle();
  }, []);

  return (
    <Layout>
      <div className="article-detail">
        {article == null ? (
          <Skeleton height={50} />
        ) : (
          <div className="article-detail__header">
            <div className="article-detail__header__title">
              <h1>{article?.title}</h1>
            </div>
            <div className="article-detail__header__info">
              <p className="icon-with-text">
                <AiFillCalendar />
                {article?.date.toLocaleDateString()}
              </p>
              <p className="icon-with-text">
                <FaClock />
                {article.readTime} min read
              </p>
            </div>
          </div>
        )}
        <div className="article-detail__content">
          {article == null ? (
            <Skeleton count={20} height={30} />
          ) : (
            <Markdown content={article.content} />
          )}
        </div>
      </div>
    </Layout>
  );
}
