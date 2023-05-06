import { useNavigate as defaultUseNavigate } from "react-router-dom";

export function useNavigate() {
  const navigator = defaultUseNavigate();

  function canGoBack() {
    return window.history.state != null && window.history.state.idx > 0;
  }

  function goHome() {
    navigator("/", { replace: true });
  }

  function goBack() {
    canGoBack() ? navigator(-1) : goHome();
  }

  function currentPath() {
    return window.location.pathname;
  }

  return { goBack, canGoBack, goHome, currentPath };
}
