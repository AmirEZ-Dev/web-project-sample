import readFile from "../services/readFileService/readFile.js";

export default async function token(req, res) {
  if (req.method === "POST" && req.url === "/token") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const parsedBody = JSON.parse(body);
        const email = parsedBody.email;
        const password = parsedBody.password;
        let db = await readFile("database.txt");
        let data = db.split("||");
        let itarator = [];

        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          let add = JSON.parse(element);
          itarator.push(add);
        }

        for (const element of itarator) {
          if (element.email === email && element.password === password) {
            const token = element.token;
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ Authorization: token }));
            return;
          }
        }

        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ error: "User not found" }));
        res.end();
      } catch (err) {
        console.error("Error processing request body:", err.message);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ error: "Invalid JSON format" }));
        res.end();
      }
    });
  }
}
