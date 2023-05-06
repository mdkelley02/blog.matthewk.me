import { RouteObject } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { useNavigate } from "../../hooks/useNavigate";
import NotFoundSvg from "../../assets/404.svg";
import "./NotFound.scss";

export const NotFoundRoute: RouteObject = {
  path: "*",
  element: <NotFound />,
};

function NotFound() {
  const { goHome } = useNavigate();

  return (
    <Layout>
      <div className="not-found">
        <div className="not-found__info">
          <div className="not-found__info__text">
            <h1>404 Not Found</h1>
            <p>The requested page could not be found.</p>
          </div>
          <button onClick={goHome}>Back Home</button>
        </div>
        <div className="not-found__graphic">
          <img src={NotFoundSvg} alt="404 Not Found" />
        </div>
      </div>
    </Layout>
  );
}
