export type Article = {
  id: string;
  title: string;
  content: string;
  date: Date;
};

type ArticleDetailResponse = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export type ArticlePartial = {
  id: string;
  title: string;
  date: Date;
};

type ArticlesResponse = {
  id: string;
  title: string;
  date: string;
}[];

const API_BASE =
  "https://kgkvetz1dg.execute-api.us-west-2.amazonaws.com/api/articles";

export function useArticles() {
  async function getArticles(): Promise<ArticlePartial[]> {
    const response = await fetch(API_BASE);
    const data: ArticlesResponse = await response.json();
    console.log("data", data);
    return data.map((article) => ({
      id: article.id,
      title: article.title,
      date: new Date(article.date),
    }));
  }

  async function getArticle(id: string): Promise<Article> {
    const response = await fetch(`${API_BASE}/${id}`);
    const data: ArticleDetailResponse = await response.json();
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      date: new Date(data.date),
    };
  }

  function readingTime(content: string): number {
    const wordsPerMinute = 220;
    const numberOfWords = content.split(/\s/g).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  }

  return {
    getArticles,
    getArticle,
    readingTime,
  };
}
