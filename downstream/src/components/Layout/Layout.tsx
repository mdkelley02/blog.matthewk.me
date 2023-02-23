import React from "react";
import Header from "../Header/Header";
import "./Layout.scss";

export type LayoutProps = {
  children: React.ReactNode;
};

function LayoutFooter() {
  return (
    <footer className="layout__footer">
      <p className="icon-with-text">&copy; Matthew Kelley</p>
    </footer>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <div className="layout__content-window">
        <Header />
        <div className="layout__main">{children}</div>
      </div>
      <LayoutFooter />
    </div>
  );
}
