import * as express from "express";
import { parse as parseUrl } from "url";
import nextapp from "../../nextapp";

const router = express.Router();
const handler = nextapp.getRequestHandler();

router.get("/profiles/:name", (req, res) => {
  const { name } = req.params;

  nextapp.render(req, res, "/profile", { userName: name });
});

router.get("/*", (req, res) => {
  const parsedUrl = parseUrl(req.url, true);

  handler(req, res, parsedUrl);
});

export default router;
