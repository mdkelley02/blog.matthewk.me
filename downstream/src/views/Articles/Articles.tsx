import { useEffect, useMemo, useState } from "react";
import { RouteObject } from "react-router-dom";
import { useArticles, ArticlePartial } from "../../hooks/useArticles";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { AiFillCalendar } from "react-icons/ai";
import InfoCard from "../../components/InfoCard/InfoCard";
import Skeleton from "react-loading-skeleton";
import "./Articles.scss";
import { FaSortAmountDownAlt, FaSortAmountUpAlt } from "react-icons/fa";
import { MdDateRange, MdTitle } from "react-icons/md";

export const ArticlesRoute: RouteObject = {
  path: "/",
  element: <Articles />,
};

function ArticleCard({ article }: { article: ArticlePartial }) {
  return (
    <li>
      <Link to={`/articles/${article.id}`}>
        <div className="card article-partial-card">
          <h3>{article.title}</h3>
          <p className="icon-with-text">
            <AiFillCalendar />
            <span>{article.date.toLocaleDateString()}</span>
          </p>
        </div>
      </Link>
    </li>
  );
}

const SortKeys = ["Title", "Date"] as const;
type SortKey = (typeof SortKeys)[number];

function Articles() {
  const { getArticles } = useArticles();
  const [articles, setArticles] = useState<ArticlePartial[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>("Date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function fetchArticles() {
      setArticles(await getArticles());
    }
    fetchArticles();
  }, []);

  const sortedArticles = useMemo(() => {
    return articles.sort((a, b) => {
      return sortOrder === "asc"
        ? sortBy === "Title"
          ? a.title.localeCompare(b.title)
          : a.date.getTime() - b.date.getTime()
        : sortBy === "Title"
        ? a.title.localeCompare(b.title)
        : b.date.getTime() - a.date.getTime();
    });
  }, [articles, sortBy, sortOrder]);

  function SortControls() {
    return (
      <div className="article-partial-container__sort">
        <div
          className="article-partial-container__sort__sort-icon"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? (
            <FaSortAmountDownAlt />
          ) : (
            <FaSortAmountUpAlt />
          )}
        </div>
        <div
          className="article-partial-container__sort__sort-icon"
          onClick={() => setSortBy(sortBy === "Title" ? "Date" : "Title")}
        >
          {sortBy === "Title" ? <MdTitle /> : <AiFillCalendar />}
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="articles-container">
        <div className="article-partial-container">
          <SortControls />
          <ul className="article-list">
            {sortedArticles.map((article, key) => (
              <ArticleCard key={key} article={article} />
            )) ?? <Skeleton count={8} height={40} />}
          </ul>
        </div>
        <div className="articles-container__info-card">
          <InfoCard />
        </div>
      </div>
    </Layout>
  );
}
