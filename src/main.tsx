import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setRefreshTokenFn, setOnRefreshFailure } from "@/api/client";
import { refreshToken, clearAuthTokens } from "@/services/authService";

// On 401: try refresh; on refresh failure clear tokens and go to login
setRefreshTokenFn(refreshToken);
setOnRefreshFailure(() => {
  clearAuthTokens();
  window.location.href = "/login";
});

createRoot(document.getElementById("root")!).render(<App />);
