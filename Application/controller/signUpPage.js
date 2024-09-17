import readFile from "../services/file/readFile.js";
import findUser from "../services/dataBase/findUser.js";
import appendDataBase from "../services/dataBase/appendDataBase.js";
import generateToken from "../services/token/generateToken.js";
import { fileURLToPath } from "url";
import path from "path";

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

const registerUser = function (req, res) {
  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      const { email, password } = JSON.parse(body);

      const result = await findUser(email, password);

      if (result.status === true) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "can`t register user , email or password taken",
          })
        );
      } else {
        const token = generateToken(email, password);
        await appendDataBase(email, password);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "can register user",
            token: token,
          })
        );
      }
    });
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
