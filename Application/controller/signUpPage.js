import readFile from "../services/readFileService/readFile.js";
import insertData from "../services/insertData/insertData.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function controlSignUpPageFunc(req, res) {
  try {
    if (req.method === "GET" && req.url === "/signUp") {
      const filePath = path.join(
        __dirname,
        "../views/signUpPageView/index.html"
      );
      const htmldata = await readFile(filePath);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(htmldata);
      res.end();
    }
    if (req.method === "POST" && req.url === "/signUp") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        console.log(body);
        const postInfo = JSON.parse(body);
        const email = postInfo.email;
        const password = postInfo.password;
        console.log("email is :", email);
        console.log("password is :", password);
        const isInserted = await insertData(email, password);

        if (isInserted) {
          res.writeHead(201, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: "can register user" }));
          res.end();
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(
            JSON.stringify({
              message: "can`t register user , email or password taken",
            })
          );
          res.end();
        }
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.write("Internal Server Error");
    res.end();
  }
}
