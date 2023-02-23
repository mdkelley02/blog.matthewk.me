import { useNavigate as _useNavigate } from "react-router-dom";

export function useNavigate() {
  const navigator = _useNavigate();

  function canGoBack() {
    return window.history.state != null && window.history.state.idx > 0;
  }

  function goHome() {
    navigator("/", { replace: true });
  }

  function goBack() {
    if (canGoBack()) {
      navigator(-1);
    } else {
      goHome();
    }
  }

  function currentPath() {
    return window.location.pathname;
  }

  return { goBack, canGoBack, goHome, currentPath };
}
