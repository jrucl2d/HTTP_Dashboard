const http = require("http");
const { send } = require("process");
const fs = require("fs").promises;
const PORT = process.env.PORT || 8000;

let session = {};

http
  .createServer(async (req, res) => {
    try {
      const tmpSession = await fs.readFile("./database/session.json");
      session = JSON.parse(tmpSession);
      switch (req.method) {
        case "GET":
          const beforeCookie = req.headers.cookie;
          if (req.url === "/") {
            if (beforeCookie) {
              const cookie = beforeCookie.split("=")[1];
              if (session[cookie]) {
                res.writeHead(302, {
                  // redirect
                  Location: "/dashboard",
                  "Content-Type": "text/plain; charset=utf-8",
                  "Set-Cookie": `session=${cookie}`,
                });
                return res.end();
              }
            }
            try {
              const data = await fs.readFile("./public/index.html");
              res.end(data);
            } catch (err) {
              throw err;
            }
          } else if (req.url === "/dashboard") {
            if (!beforeCookie) {
              res.writeHead(302, {
                // redirect
                Location: "/",
                "Content-Type": "text/plain; charset=utf-8",
              });
              return res.end();
            }
            try {
              const data = await fs.readFile("./public/dashboard.html");
              res.end(data);
            } catch (err) {
              throw err;
            }
          } else if (req.url === "/logout") {
            const cookie = req.headers.cookie.split("=")[1];
            delete session[cookie];
            session = {};
            await fs.writeFile("./database/session.json", JSON.stringify(session));
            const tmpDate = new Date();
            tmpDate.setDate(tmpDate.getDate() - 1);

            res.writeHead(302, {
              // redirect
              Location: "/",
              "Content-Type": "text/plain; charset=utf-8",
              "Set-Cookie": `session= ; Expires=${tmpDate.toString()}`,
            });
            res.end();
          } else if (req.url === "/info") {
            try {
              const data = await fs.readFile("./database/dashboard.json");
              const words = JSON.parse(data);
              const id = session[beforeCookie.split("=")[1]];
              const sendingData = { id, words };
              res.end(JSON.stringify(sendingData));
            } catch (err) {
              throw err;
            }
          } else {
            // 정적 파일 제공
            const data = await fs.readFile(`./public${req.url}`);
            res.end(data);
          }
          break;
        case "POST":
          if (req.url === "/login") {
            let body = "";
            req.on("data", (data) => (body += data));
            req.on("end", async () => {
              const { id, password } = JSON.parse(body);
              // console.log(`${id} ${password} 로그인`);
              const usersData = await fs.readFile("./database/user.json");
              const users = JSON.parse(usersData);
              if (findUser(users, id, password)) {
                const randomInt = Date.now();
                session[randomInt] = id;
                await fs.writeFile("./database/session.json", JSON.stringify(session));
                res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Set-Cookie": `session=${randomInt}; HttpOnly; Path=/` });
                return res.end("good");
              }
              res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
              res.end("no");
            });
          } else if (req.url === "/register") {
            let body = "";
            req.on("data", (data) => (body += data));
            req.on("end", async () => {
              const { id, password } = JSON.parse(body);
              // console.log(`${id} ${password} 회원가입`);
              const usersData = await fs.readFile("./database/user.json");
              const users = JSON.parse(usersData);
              // 이미 존재하는 계정
              if (findUser(users, id, password)) {
                res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                return res.end("exist");
              }
              users[Date.now()] = { id, password };
              await fs.writeFile("./database/user.json", JSON.stringify(users));
              res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
              res.end("good");
            });
          }
          break;
        case "PUT":
          break;
        case "DELETE":
          break;
      }
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(err.message);
    }
  })
  .listen(PORT, () => `The server is running on ${PORT}`);

function findUser(users, id, password) {
  for (key in users) {
    if (users[key].id === id && users[key].password === password) {
      return true;
    }
  }
  return false;
}
