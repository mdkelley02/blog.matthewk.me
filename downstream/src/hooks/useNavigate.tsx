import React from "react";
import { useNavigate as defaultUseNavigate } from "react-router-dom";

export function useNavigate() {
  const navigator = defaultUseNavigate();

  // function canGoBack() {
  //   return window.history.state != null && window.history.state.idx > 0;
  // }
  const canGoBack = React.useCallback(() => {
    return window.history.state != null && window.history.state.idx > 0;
  }, []);

  function goHome() {
    if (currentPath() !== "/") {
      navigator("/");
    }
  }

  function goBack() {
    canGoBack() ? navigator(-1) : goHome();
  }

  function currentPath() {
    return window.location.pathname;
  }

  return { goBack, canGoBack, goHome, currentPath };
}
