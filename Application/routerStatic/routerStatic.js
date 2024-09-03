import {
  handleMainPageCss,
  handleMainPageJs,
} from "../controllerStatic/mainPage.js";
import { handleSignInCss } from "../controllerStatic/signInPage.js";
export default async function routerStatic(req, res) {
  try {
    if (req.method === "GET" && !res.headersSent) {
      switch (req.url) {
        case "/static/mainPage/style.css":
          handleMainPageCss(req, res);
          break;
        case "/static/mainPage/script.js":
          handleMainPageJs(req, res);
          break;
        case "/static/signInPage/style.css":
          handleSignInCss(req, res);
          break;
        default:
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.write(`${req.url} not found`);
          res.end();
          break;
      }
    }
    if (req.method === "POST" && !res.headersSent) {
      switch (req.url) {
        case "/static/signInPage/style.css":
          handleSignInCss(req, res);
          break;
        default:
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.write(`${req.url} not found`);
          res.end();
          break;
      }
    }
  } catch (error) {
    console.trace();
    console.error("Router error:", error.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.write("Internal Server Error");
    res.end();
  }
}
