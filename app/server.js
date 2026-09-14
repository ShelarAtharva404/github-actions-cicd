const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("nikhil ka bbap usko kutte ke maut marega\n");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
