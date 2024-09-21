import authenticationController from "../controller/authentication.js";
import homeController from "../controller/home.js";
import mainController from "../controller/main.js";
import signInController from "../controller/signIn.js";
import signUpController from "../controller/signUp.js";

export default async function router(req, res) {
  console.log(req.method, req.url);
  try {
    if (req.method === "GET") {
      switch (req.url) {
        case "/":
          mainController.sendMainPage(req, res);
          break;
        case "/home":
          homeController.sendHomePage(req, res);
          break;
        case "/signIn":
          signInController.sendSignInPage(req, res);
          break;
        case "/signUp":
          signUpController.sendSignUpPage(req, res);
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
          signUpController.registerUser(req, res);
          break;
        case "/signIn":
          signInController.signInUser(req, res);
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
