import readFile from "../file/readFile.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function readDataBase() {
  const filePath = path.join(__dirname, "../../../database.txt");
  let dataBase = await readFile(filePath);
  const users = dataBase.split("||").map((user) => {
    return JSON.parse(user);
  });
  return users;
}
