import TokenManagement from "../services/Security/Encryption/TokenManagement.js";
const tokenManagement = new TokenManagement();
const verify = async function (req, res) {
  let body = "";
  try {
    req.on("data", (chunc) => {
      body += chunc;
    });
    req.on("end", () => {
      const { token } = JSON.parse(body);
      const verifyTokenResulte = tokenManagement.verifyToken(token);

      if (verifyTokenResulte.status === true) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: verifyTokenResulte.message }));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: verifyTokenResulte.message }));
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
