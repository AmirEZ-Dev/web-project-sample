import verifyToken from "../services/token/verifyToken.js";
const verify = async function (req, res) {
  let body = "";
  try {
    req.on("data", (data) => {
      body += data;
    });
    req.on("end", () => {
      const { token } = JSON.parse(body);

      const verifyResult = verifyToken(token);

      if (verifyResult === true) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Your token is valid" }));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Your token has expired" }));
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
};
const authenticationController = { verify };
export default authenticationController;
