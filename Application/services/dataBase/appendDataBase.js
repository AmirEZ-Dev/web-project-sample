import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function appendDataBase(email, password) {
  const filePath = path.join(__dirname, "../../../database.txt");
  await fs.appendFile(
    filePath,
    `||{"email":"${email}" , "password":"${password}"}`,
    "utf-8"
  );
}
