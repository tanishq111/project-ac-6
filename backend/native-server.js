import { createServer } from "node:http";
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Native Server</title>
</head>
<body>
  <h1>Hello from Native Server</h1>
</body>
</html>
`;  
// - /api/health
// - /api/greet
// - /api/pay
const server = createServer((req, res) => {
    if(req.method === "GET" && req.url === "/api/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
      return;
    }
    else if(req.method === "GET" && req.url === "/api/greet") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Hello from Native Server" }));
      return;
    }
    else if(req.method === "GET" && req.url === "/api/pay") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "payment successful" }));
      return;
    }
    else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not Found" }));
      return;
    }
});

server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Native server: http://127.0.0.1:3000");
});