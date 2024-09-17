import * as fs from "fs/promises";

export default async function readFile(url) {
  try {
    const data = await fs.readFile(url, "utf-8");
    return data;
  } catch (error) {
    throw Error("can`t read file", error.message);
  }
}
