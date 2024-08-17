import readFile from "../services/readFileService/readFile.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function controlhomePageFunc(req, res) {
  try {
    if (req.method === "GET" && req.url === "/home") {
      const filePath = path.join(__dirname, "../views/homePageView/index.html");
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
}
