import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ArticlesRoute } from "./views/Articles/Articles";
import { ArticleDetailRoute } from "./views/ArticleDetail/ArticleDetail";
import { NotFoundRoute } from "./views/NotFound/NotFound";
import { SkeletonTheme } from "react-loading-skeleton";
import { Colors } from "react-select";

import "./index.scss";
import "react-loading-skeleton/dist/skeleton.css";

const ROUTES = createBrowserRouter([
  ArticlesRoute,
  ArticleDetailRoute,
  NotFoundRoute,
]);

function App() {
  return (
    <SkeletonTheme height={18}>
      <RouterProvider router={ROUTES} />
    </SkeletonTheme>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
