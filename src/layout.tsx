/** @jsx jsx */
/** @jsxFrag Fragment */

import type { PropsWithChildren } from "hono/jsx";
import { jsx } from "hono/jsx";
import { Page } from "./index.tsx";

function Layout(props: PropsWithChildren<{ site: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Referer analytics for {props.site}</title>
      </head>

      <body>{props.children}</body>
    </html>
  );
}

export function Pages({ site, pages }: { site: string; pages: Page[] }) {
  return (
    <Layout site={site}>
      <div id="app">
        <h1>
          Analytics for <a href={site} target="_blank">{site}</a>
        </h1>
        <p>
          Powered by{" "}
          <a href="https://github.com/pcalves/referalytics">referalytics</a>.
          Analytics, but just the{" "}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer"
            target="_blank"
          >
            referers
          </a>. No numbers allowed.
        </p>

        <ul id="list">
          {pages.map(({ referers, slug }) => (
            <li>
              <h2>
                <a href={site + slug}>{slug}</a>
              </h2>
              <ul>
                {referers.map(({ url }) => (
                  <li>
                    <a href={url}>{url}</a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
