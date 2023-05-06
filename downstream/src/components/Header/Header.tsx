import { useTheme, ThemeIcons } from "../../hooks/useTheme";
import { useNavigate } from "../../hooks/useNavigate";
import { Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import "./Header.scss";

export default function Header() {
  return (
    <div className="header-container">
      <LeftHeader />
      <RightHeader />
    </div>
  );
}

function LeftHeader() {
  const { goHome } = useNavigate();

  return (
    <div className="header-container__section">
      <h2 className="header-container__section__logo" onClick={goHome}>
        Matthew Kelley
      </h2>
    </div>
  );
}

function RightHeader() {
  const { canGoBack, goBack } = useNavigate();
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="header-container__section">
      <Link className="hide-mobile" target="_blank" to={"https://matthewk.me"}>
        <p className="header-container__section__item">About</p>
      </Link>
      <div className="header-container__section__item" onClick={toggleTheme}>
        {ThemeIcons[theme]}
      </div>
      {canGoBack() && (
        <div className="header-container__section__item" onClick={goBack}>
          <FaChevronLeft />
        </div>
      )}
    </div>
  );
}
