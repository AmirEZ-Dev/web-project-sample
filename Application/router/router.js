import controlMainPage from "../controller/mainPage.js";
import controlSignInPage from "../controller/signInPage.js";
import controlhomePageFunc from "../controller/homePage.js";
import controlSignUpPageFunc from "../controller/signUpPage.js";
import token from "../controller/token.js";
import verifyToken from "../controller/verifyToken.js";

export default async function router(req, res) {
  console.log("Requested URL : ", req.url);
  console.log("request method : ", req.method);

  try {
    if (req.method === "GET") {
      switch (req.url) {
        case "/":
          controlMainPage.controlMainPageFunc(req, res);
          break;
        case "/home":
          controlhomePageFunc(req, res);
          break;
        case "/signIn":
          controlSignInPage.getSignIn(req, res);
          break;
        case "/signUp":
          controlSignUpPageFunc(req, res);
          break;

        default:
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.write(`${req.url} not found`);
          res.end();

          break;
      }
    }
    if (req.method === "POST") {
      switch (req.url) {
        case "/signUp":
          controlSignUpPageFunc(req, res);
          break;
        case "/signIn":
          controlSignInPage.postSignIn(req, res);
          break;
        case "/token":
          token(req, res);
          break;
        case "/verifyToken":
          verifyToken(req, res);
          break;
        default:
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.write(`${req.url} not found`);
          res.end();
          break;
      }
    }
  } catch (error) {
    console.error("Router error:", error.message);
    console.trace();
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.write("Internal Server Error");
    res.end();
  }
}
