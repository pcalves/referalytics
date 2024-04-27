/** @jsx jsx */

import { PathLike } from "node:fs";

import { Hono } from "hono";
import { jsx } from "hono/jsx";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { Pages } from "./layout.tsx";

async function JSONFilePreset<Data>(
  filename: PathLike,
  defaultData: Data,
): Promise<Low<Data>> {
  const adapter = new JSONFile<Data>(filename);
  const db = new Low<Data>(adapter, defaultData);
  await db.read();
  return db;
}

const app = new Hono();

type Referer = {
  url: string;
};

export type Page = {
  slug: string;
  referers: Referer[];
};

type Data = {
  pages: Page[];
};

const db = await JSONFilePreset<Data>("db.json", { pages: [] });

const { pages } = db.data;

app.get("/", (c) => {
  const props = {
    site: Deno.env.get("SITE") || "https://www.example.com",
    pages,
  };

  return c.html(
    <Pages {...props} />,
  );
});

app.post(
  "/pages",
  async (c) => {
    if (!c.req.query("slug")) {
      return c.body("Missing slug parameter", 400);
    }

    const referer = await c.req.json() as Referer;

    const page = pages.find((p) => p.slug === c.req.query("slug"));
    const existingReferer = page?.referers.find((r) => r.url === referer.url);

    if (page && !existingReferer) {
      await db.update(({ pages }) => {
        pages[pages.indexOf(page)].referers = [...page.referers, referer];
      });
    } else if (!page) {
      await db.update(({ pages }) =>
        pages.push({
          slug: String(c.req.query("slug")),
          referers: [referer],
        })
      );
    }

    return c.body("Created", 201);
  },
);

Deno.serve(app.fetch);
