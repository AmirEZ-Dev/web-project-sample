import readFile from "../readFileService/readFile.js";
import * as fs from "fs/promises";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default async function insertData(emaill, passwordd) {
  let db = await readFile("database.txt");
  let exists = false;
  let data = db.split("||");
  let itarator = [];

  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    let add = JSON.parse(element);
    itarator.push(add);
  }

  for (const element of itarator) {
    if (element.email === emaill && element.password === passwordd) {
      exists = true;
      break;
    }
  }

  if (exists) {
    return false;
  } else {
    const payload = {
      email: emaill,
      password: passwordd,
    };
    const secret = process.env.SECRET_KEY;

    const options = {
      expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
      algorithm: "HS256",
    };
    const token = jwt.sign(payload, secret, options);

    try {
      await fs.appendFile(
        "database.txt",
        `||{"email":"${emaill}" , "password":"${passwordd}" , "token":"${token}"}`,
        "utf-8"
      );
      return true;
    } catch (err) {
      console.error("Error in insert data:", err.message);
      return false;
    }
  }
}
