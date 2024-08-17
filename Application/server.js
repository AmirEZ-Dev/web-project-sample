import http from "http";
import dotenv from "dotenv";
import check from "./services/checkURL/checkURL.js";
import { setInterval } from "timers/promises";
dotenv.config();

export default function startApplication() {
  const port = process.env.PORT ?? 8080;
  const host = process.env.HOST ?? "localhost";
  try {
    const server = http.createServer((req, res) => {
      try {
        check(req.url, req, res);
      } catch (error) {
        console.trace();
        console.error("Request error:", error.message);
      }
    });

    server.listen(port, host, () => {
      console.log(`Application running on http://${host}:${port}`);
    });
  } catch (error) {
    console.log("can`t create server : ", error.message);
  }
}
