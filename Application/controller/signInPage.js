import * as fs from "fs/promises";
import readFile from "../services/readFileService/readFile.js";
import { fileURLToPath } from "url";
import path from "path";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const controlSignInPageFunc = async function (req, res) {
  try {
    if (req.method === "GET" && req.url === "/signIn") {
      const filePath = path.join(
        __dirname,
        "../views/signInPageView/index.html"
      );
      const htmldata = await readFile(filePath);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(htmldata);
      res.end();
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.write("Internal Server Error");
    res.end();
  }
};

const controlSignInPost = async function (req, res) {
  try {
    let body = "";
    req.on("data", (data) => {
      body += data;
    });
    req.on("end", async () => {
      try {
        const postInfo = JSON.parse(body);
        let { email, password } = postInfo;
        let db = await fs.readFile("database.txt", "utf-8");
        let data = db.split("||");
        let userFound = false;

        for (let index = 0; index < data.length; index++) {
          let element = JSON.parse(data[index]);

          if (element.email === email && element.password === password) {
            userFound = true;

            const payload = {
              email: element.email,
              password: element.password,
            };
            const secret = process.env.SECRET_KEY;
            const options = { expiresIn: "1h", algorithm: "HS256" };
            const token = jwt.sign(payload, secret, options);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ authToken: token }));
            console.log("send response");
            return;
          }
        }

        if (!userFound) {
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
  controlSignInPageFunc,
  controlSignInPost,
};

export default controlSignInPage;
