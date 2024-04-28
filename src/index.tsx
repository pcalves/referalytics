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

export type Page = {
  slug: string;
  referers: string[];
};

type Data = {
  pages: Page[];
};

const db = await JSONFilePreset<Data>("db.json", { pages: [] });

const { pages } = db.data;

const app = new Hono();

app.get("/", (c) => {
  const props = {
    site: Deno.env.get("SITE") || "https://www.example.com",
    pages,
  };

  return c.html(
    <Pages {...props} />,
  );
});

app.get(
  "/log",
  async (c) => {
    const slug = decodeURI(c.req.query("slug") ?? "");
    const referer = decodeURI(c.req.query("referer") ?? "");

    if (!slug || !referer) {
      return c.body("Missing parameter", 400);
    }

    const page = pages.find((p) => p.slug === slug);

    if (page && !page.referers.includes(referer)) {
      await db.update(({ pages }) => {
        pages[pages.indexOf(page)].referers = [...page.referers, referer];
      });
    } else if (!page) {
      await db.update(({ pages }) =>
        pages.push({
          slug,
          referers: [referer],
        })
      );
    }

    return c.body("Created", 201);
  },
);

Deno.serve(app.fetch);
