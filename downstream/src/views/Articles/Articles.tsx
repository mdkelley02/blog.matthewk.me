import { useEffect, useState } from "react";
import { RouteObject } from "react-router-dom";
import { useArticles, ArticlePartial } from "../../hooks/useArticles";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { AiFillCalendar } from "react-icons/ai";
import InfoCard from "../../components/InfoCard/InfoCard";
import Skeleton from "react-loading-skeleton";
import "./Articles.scss";

export const ArticlesRoute: RouteObject = {
  path: "/",
  element: <Articles />,
};

function ArticleCard({ article }: { article: ArticlePartial }) {
  return (
    <li>
      <Link to={`/articles/${article.id}`}>
        <div className="card article-partial-card">
          <h4>{article.title}</h4>
          <p className="icon-with-text">
            <AiFillCalendar />
            <span>{article.date.toLocaleDateString()}</span>
          </p>
        </div>
      </Link>
    </li>
  );
}

function Articles() {
  const { getArticles } = useArticles();
  const [articles, setArticles] = useState<ArticlePartial[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      setArticles(await getArticles());
    }
    fetchArticles();
  }, []);

  return (
    <Layout>
      <div className="articles-container">
        <ul className="article-partial-container">
          {articles?.map((article, key) => (
            <ArticleCard key={key} article={article} />
          )) ?? <Skeleton count={8} height={40} />}
        </ul>
        <div className="articles-container__info-card">
          <InfoCard />
        </div>
      </div>
    </Layout>
  );
}
