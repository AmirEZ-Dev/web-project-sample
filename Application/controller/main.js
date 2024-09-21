import readFile from "../services/file/readFile.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendMainPage = async function (req, res) {
  try {
    const filePath = path.join(__dirname, "../views/mainPageView/index.html");
    const htmlData = await readFile(filePath);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(htmlData);
    res.end();
  } catch (error) {
    console.error("Error:", error.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.write("Internal Server Error");
    res.end();
  }
};
const mainPageController = {
  sendMainPage,
};
export default mainPageController;
