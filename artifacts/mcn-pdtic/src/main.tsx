import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Vindo do 404.html do GitHub Pages: ?rota=caminho → restaura a rota interna.
const rota = new URLSearchParams(window.location.search).get("rota");
if (rota) window.history.replaceState(null, "", import.meta.env.BASE_URL + rota.replace(/^\//, ""));

createRoot(document.getElementById("root")!).render(<App />);
