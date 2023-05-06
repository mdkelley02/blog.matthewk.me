import { useEffect } from "react";
import { StorageKeys, useLocalStorage } from "./useLocalStorage";

type GetArticleResponse = {
  id: string;
  title: string;
  content: string;
  date: string;
};

type GetArticlesResponse = {
  id: string;
  title: string;
  date: string;
}[];

function parseGetArticlesResponse(
  response: GetArticlesResponse
): ArticlePartial[] {
  return response.map((article) => ({
    id: article.id,
    title: article.title,
    date: new Date(article.date),
  }));
}

export type Article = {
  id: string;
  title: string;
  content: string;
  date: Date;
  readTime: number;
};

export type ArticlePartial = {
  id: string;
  title: string;
  date: Date;
};

const API_BASE =
  "https://kgkvetz1dg.execute-api.us-west-2.amazonaws.com/api/articles";

const AVG_WPM = 220;

function calcReadTime(content: string): number {
  return Math.ceil(content.split(/\s/g).length / AVG_WPM);
}

export function useArticles() {
  async function getArticles(tryCache = true): Promise<ArticlePartial[]> {
    try {
      const response = await fetch(API_BASE);
      const data: GetArticlesResponse = await response.json();
      return parseGetArticlesResponse(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      return [];
    }
  }

  async function getArticle(id: string): Promise<Article | null> {
    try {
      const response = await fetch(`${API_BASE}/${id}`);
      const data: GetArticleResponse = await response.json();
      return {
        ...parseGetArticlesResponse([data])[0],
        readTime: calcReadTime(data.content),
        content: data.content,
      };
    } catch (error) {
      console.error(`Error fetching article with id ${id}:`, error);
      return null;
    }
  }

  return {
    getArticles,
    getArticle,
  };
}
