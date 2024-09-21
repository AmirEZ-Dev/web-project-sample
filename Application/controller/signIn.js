import { fileURLToPath } from "url";
import path from "path";
import readFile from "../services/file/readFile.js";
import { UserSignIn } from "../services/UsersServices/UsersServices01.js";
import HashingService from "../services/Security/Encryption/HashingService.js";
const hashingService = new HashingService();
import TokenManagement from "../services/Security/Encryption/TokenManagement.js";
const tokenManagement = new TokenManagement();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendSignInPage = async function (req, res) {
  try {
    const filePath = path.join(__dirname, "../views/signInPageView/index.html");
    const htmldata = await readFile(filePath);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(htmldata);
    res.end();
  } catch (error) {
    console.error("Error:", error.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
};

const signInUser = async function (req, res) {
  const userSignIn = new UserSignIn(req, hashingService, tokenManagement);
  try {
    const result = await userSignIn.signIn();
    if (result.status === "successful") {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ authToken: result.authToken }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: result.message }));
    }
  } catch (err) {
    console.error("error in process form data : ", err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};

const signInPageController = {
  sendSignInPage,
  signInUser,
};

export default signInPageController;
