import mainPageController from "../controller/mainPage.js";
import signInPageController from "../controller/signInPage.js";
import homePageController from "../controller/homePage.js";
import signUpPageController from "../controller/signUpPage.js";
import authenticationController from "../controller/authentication.js";

export default async function router(req, res) {
  console.log(req.method, req.url);
  try {
    if (req.method === "GET") {
      switch (req.url) {
        case "/":
          mainPageController.sendMainPage(req, res);
          break;
        case "/home":
          homePageController.sendHomePage(req, res);
          break;
        case "/signIn":
          signInPageController.sendSignInPage(req, res);
          break;
        case "/signUp":
          signUpPageController.sendSignUpPage(req, res);
          break;
        default:
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`${req.url} not found`);
          break;
      }
    }
    if (req.method === "POST") {
      switch (req.url) {
        case "/signUp":
          signUpPageController.registerUser(req, res);
          break;
        case "/signIn":
          signInPageController.signInUser(req, res);
          break;
        case "/authentication":
          authenticationController.verify(req, res);
          break;
        default:
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`${req.url} not found`);
          break;
      }
    }
  } catch (error) {
    console.error("Router error:", error.message);
    console.trace();
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("The requested resource was not found");
  }
}
