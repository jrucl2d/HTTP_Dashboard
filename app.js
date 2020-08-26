const http = require("http");
const fs = require("fs").promises;
const PORT = process.env.PORT || 8000;

const server = http
  .createServer(async (req, res) => {
    try {
      if (req.method === "GET") {
        if (req.url === "/") {
          const data = await fs.readFile("./public/index.html");
          res.end(data);
        } else if (req.url === "/dashboard") {
          console.log("왔냐");
          // 여기서 대시보드 정보 전해줘야 함(이름, 글, 주인이면 수정/삭제)
        } else {
          // 정적 파일 제공
          const data = await fs.readFile(`./public${req.url}`);
          res.end(data);
        }
      } else if (req.method === "POST") {
        if (req.url === "/login") {
          let body = "";
          req.on("data", (data) => (body += data));
          req.on("end", () => {
            const { id, password } = JSON.parse(body);
            // console.log(`${id} ${password} 로그인`);
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("good");
          });
        }
      }
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(err.message);
    }
  })
  .listen(PORT, () => `The server is running on ${PORT}`);
