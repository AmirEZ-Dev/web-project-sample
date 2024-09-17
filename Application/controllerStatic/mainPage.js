import readFile from "../services/file/readFile.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function handleMainPageCss(req, res) {
  try {
    const filePath = path.join(__dirname, "../static/mainPage/style.css");
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": "text/css" });
    res.write(data);
    res.end();
  } catch (error) {
    console.error("Error:", error.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.write("Internal Server Error");
    res.end();
  }
}
export async function handleMainPageJs(req, res) {
  try {
    const filePath = path.join(__dirname, "../static/mainPage/script.js");
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": "text/javascript" });
    res.write(data);
    res.end();
  } catch (error) {
    console.error("Error:", error.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.write("Internal Server Error");
    res.end();
  }
}
