import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ArticlesRoute } from "./views/Articles/Articles";
import { ArticleDetailRoute } from "./views/ArticleDetail/ArticleDetail";
import { NotFoundRoute } from "./views/NotFound/NotFound";
import { SkeletonTheme } from "react-loading-skeleton";
import { SkeletonThemeStyles, ThemeColor, useTheme } from "./hooks/useTheme";

import "./index.scss";
import "react-loading-skeleton/dist/skeleton.css";

const ROUTES = createBrowserRouter([
  ArticlesRoute,
  ArticleDetailRoute,
  NotFoundRoute,
]);

function App() {
  const [theme] = useTheme();
  const [skeletonStyle, setSkeletonStyle] = useState<
    typeof SkeletonThemeStyles[ThemeColor]
  >(SkeletonThemeStyles[theme]);
  // const { baseColor, highlightColor } = SkeletonThemeStyles[theme];

  useEffect(() => {
    setSkeletonStyle(SkeletonThemeStyles[theme]);
  }, [theme]);

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
