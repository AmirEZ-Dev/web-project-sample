import * as fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const findUser = async function (em, pas) {
  let dataBase = await fs.readFile("database.txt", "utf-8");
  let users = dataBase.split("||").map((user) => JSON.parse(user));
  let status = false;
  for (const element of users) {
    if (element.email === em && element.password === pas) status = true;
  }
  return status;
};
const generateToken = function (em, pas) {
  const payload = {
    email: em,
    password: pas,
  };
  const secret = process.env.SECRET_KEY;
  const options = { expiresIn: "1h", algorithm: "HS256" };
  return jwt.sign(payload, secret, options);
};
const getSignIn = async function (req, res) {
  try {
    const filePath = path.join(__dirname, "../views/signInPageView/index.html");
    const htmldata = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(htmldata);
    res.end();
  } catch (error) {
    console.error("Error:", error.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
};

const postSignIn = async function (req, res) {
  try {
    let body = "";
    req.on("data", (data) => {
      body += data;
    });
    req.on("end", async () => {
      try {
        let { email, password } = JSON.parse(body);
        if (await findUser(email, password)) {
          const token = generateToken(email, password);

          res.writeHead(200, {
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify({ authToken: token }));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "User not found" }));
        }
      } catch (error) {
        console.error("Error processing request:", error.message);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid request data" }));
      }
    });
  } catch (err) {
    console.error("error in process form data : ", err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};
const controlSignInPage = {
  getSignIn,
  postSignIn,
};

export default controlSignInPage;
