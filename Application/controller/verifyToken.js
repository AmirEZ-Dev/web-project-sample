import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export default async function verifyToken(req, res) {
  let body = "";
  try {
    req.on("data", (data) => {
      body += data;
    });
    req.on("end", () => {
      const postInfo = JSON.parse(body);
      const token = postInfo.authToken;
      const secret = process.env.SECRET_KEY;
      jwt.verify(token, secret, (err) => {
        if (err) {
          console.log("error in verifyToken");
          res.writeHead(401, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ error: "Your token has expired" }));
          res.end();
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: "Your token is valid" }));
          res.end();
        }
      });
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.write("Internal Server Error");
    res.end();
  }
}
