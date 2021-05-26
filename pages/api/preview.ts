import { NextApiHandler } from "next";

const handler: NextApiHandler = (req, res) => {
  if (req.query.mode && req.query.path) {
    switch (req.query.mode) {
      case "public":
        res.clearPreviewData();
        res.redirect(302, req.query.path as string);
        return;
      case "preview":
        res.setPreviewData({});
        res.redirect(302, req.query.path as string);
        return;
    }

    res.send("Bad request");
    res.status(400).end();
    return;
  }

  if (req.query.cancel) {
    res.clearPreviewData();
    res.end("Preview mode disabled");
  } else {
    res.setPreviewData({});
    res.end("Preview mode enabled");
  }
};

export default handler;
