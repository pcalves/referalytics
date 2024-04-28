/** @jsx jsx */

import { Hono } from "hono";
import { jsx } from "hono/jsx";
import { Pages } from "./layout.tsx";

export type Page = {
  slug: string;
  referers: string[];
};

type Data = {
  pages: Page[];
};

const kv = await Deno.openKv();

const app = new Hono();

app.get("/", async (c) => {
  const entries = await kv.list<Page>({ prefix: ["pages"] });

  const pages: Page[] = [];
  for await (const { key, value } of entries) {
    pages.push(value);
  }

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

    if (location.href.includes(referer)) {
      return c.body("Prevent self-referrals", 400);
    }

    const key = ["pages", slug];
    const item = await kv.get<Page>(key);
    if (item.value && !item.value.referers.includes(referer)) {
      kv.set(key, {
        slug,
        referers: [...item.value.referers, referer],
      });
    } else if (!item.value) {
      kv.set(key, {
        slug,
        referers: [referer],
      });
    }

    return c.body("Created", 201);
  },
);

Deno.serve(app.fetch);
