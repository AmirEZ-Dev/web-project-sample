import readFile from "../services/file/readFile.js";
import findUser from "../services/dataBase/findUser.js";
import generateToken from "../services/token/generateToken.js";
import { fileURLToPath } from "url";
import path from "path";

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
  try {
    let body = "";
    req.on("data", (data) => {
      body += data;
    });
    req.on("end", async () => {
      const { email, password } = JSON.parse(body);

      const result = await findUser(email, password);

      if (result.status === true) {
        const token = generateToken(email, password);
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ authToken: token }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found" }));
      }
    });
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
