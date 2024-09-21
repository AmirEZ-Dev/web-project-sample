import { fileURLToPath } from "url";
import path from "path";
import readFile from "../services/file/readFile.js";
import { UserRegister } from "../services/UsersServices/UsersServices01.js";
import HashingService from "../services/Security/Encryption/HashingService.js";
const hashingService = new HashingService();
import TokenManagement from "../services/Security/Encryption/TokenManagement.js";
const tokenManagement = new TokenManagement();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendSignUpPage = async function (req, res) {
  try {
    const filePath = path.join(__dirname, "../views/signUpPageView/index.html");
    const htmlData = await readFile(filePath);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(htmlData);
  } catch (error) {
    console.error("Error:", error.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
};

const registerUser = async function (req, res) {
  const userRegister = new UserRegister(req, hashingService, tokenManagement);
  try {
    const result = await userRegister.register();
    if (result.status === "successful") {
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: result.status,
          message: result.message,
          authToken: result.authToken,
        })
      );
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: result.status,
          message: result.message,
        })
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
};

const signUpPageController = {
  sendSignUpPage,
  registerUser,
};

export default signUpPageController;
