import express from "express";
import asyncHandler from "express-async-handler";
import serverless from "serverless-http";
import ViteExpress from "vite-express";

import JSONFilePreset from "./init.js";

const app = express();

app.use(express.json());

type Referer = {
  url: string;
};

type Page = {
  slug: string;
  referers: Referer[];
};

type Data = {
  pages: Page[];
};

const db = await JSONFilePreset<Data>("db.json", { pages: [] });

const { pages } = db.data;

app.get("/pages", (_req, res) => {
  res.send(pages);
});

app.post(
  "/pages",
  asyncHandler(async (req, res) => {
    if (!req.query.slug) {
      res.status(400).send("Missing slug query parameter");

      return;
    }

    const referer = req.body as Referer;

    console.log({ referer });
    const page = pages.find((p) => p.slug === req.query.slug);
    const existingReferer = page?.referers.find((r) => r.url === referer.url);

    if (page && !existingReferer) {
      await db.update(({ pages }) => {
        pages[pages.indexOf(page)].referers = [...page.referers, referer];
      });
    } else if (!page) {
      await db.update(({ pages }) =>
        pages.push({
          slug: req.query.slug as string,
          referers: [referer],
        }),
      );
    }

    res.status(201).send();
  }),
);

if (process.env.NODE_ENV !== "production") {
  ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on port 3000..."),
  );
}

export const handler = serverless(app);
