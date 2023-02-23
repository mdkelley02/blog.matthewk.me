import React, { useState } from "react";
import "./Header.scss";
import { useTheme, ThemeIcons } from "../../hooks/useTheme";
import { useNavigate } from "../../hooks/useNavigate";
import { Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";

function LeftHeader() {
  const { goHome } = useNavigate();
  return (
    <div className="header-container__section">
      <h4 className="header-container__section__logo" onClick={goHome}>
        Matthew Kelley
      </h4>
    </div>
  );
}

function RightHeader() {
  const { canGoBack, goBack } = useNavigate();
  const [theme, toggleTheme] = useTheme();
  return (
    <div className="header-container__section">
      {/* About */}
      <Link className="hide-mobile" target="_blank" to={"https://matthewk.me"}>
        <p className="header-container__section__item">About</p>
      </Link>

      {/* Theme Switch */}
      <p className="header-container__section__item" onClick={toggleTheme}>
        {ThemeIcons[theme]}
      </p>

      {/* Back */}
      {canGoBack() && (
        <p className="header-container__section__item" onClick={goBack}>
          <FaChevronLeft />
        </p>
      )}
    </div>
  );
}

export default function Header() {
  return (
    <div className="header-container">
      <LeftHeader />
      <RightHeader />
    </div>
  );
}
