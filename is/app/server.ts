import express from "express";
import next from "next";

const dev: boolean = process.env.NODE_ENV !== "production";
const app: next.Server = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server: express.Application = express();

    server.get("*", (req: express.Request, res: express.Response) => {
      return handle(req, res);
    });

    server.listen(3000, (err: Error) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
