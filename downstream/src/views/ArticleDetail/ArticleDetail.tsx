import { useState, useEffect } from "react";
import { useParams, RouteObject } from "react-router-dom";
import { Article, useArticles } from "../../hooks/useArticles";
import Layout from "../../components/Layout/Layout";
import { FaClock } from "react-icons/fa";
import { AiFillCalendar } from "react-icons/ai";
import Markdown from "../../components/Markdown/Markdown";
import Skeleton from "react-loading-skeleton";
import "./ArticleDetail.scss";

type ArticleDetailParams = {
  articleId: string;
};

export const ArticleDetailRoute: RouteObject = {
  path: "/articles/:articleId",
  element: <ArticleDetail />,
};

export default function ArticleDetail() {
  const [markdownContent, setMarkdownContent] = useState<Article>();
  const { articleId } = useParams<ArticleDetailParams>();
  const { getArticle, readingTime } = useArticles();

  useEffect(() => {
    async function fetchMarkdown() {
      const article = await getArticle(articleId ?? "");
      setMarkdownContent(article);
    }
    fetchMarkdown();
  }, []);

  return (
    <Layout>
      <div className="article-detail">
        {markdownContent == null ? (
          <Skeleton height={40} />
        ) : (
          <div className="article-detail__header">
            <h1>{markdownContent?.title}</h1>
            <div className="article-detail__header__info">
              <p className="icon-with-text">
                <AiFillCalendar />
                {markdownContent?.date.toLocaleDateString()}
              </p>
              <p className="icon-with-text">
                <FaClock />
                {readingTime(markdownContent?.content ?? "")} min read
              </p>
            </div>
          </div>
        )}

        <div className="article-detail__content">
          {markdownContent == null ? (
            <Skeleton count={10} height={20} />
          ) : (
            <Markdown content={markdownContent.content} />
          )}
        </div>
      </div>
    </Layout>
  );
}
