# referalytics

Analytics, but just the referers. No numbers allowed.

## Why?

Generally speaking, [I don't like analytics or any other metrics](https://pcalv.es/reject-numbers-embrace-connections/) that measure engagement or virality. They're a source of anxiety and stress and don't tell me much about who is coming to my site. The only thing I care about is where they're coming from - mostly so I can know who's linking to me and check them out.

I couldn't find a tool that did this, so I made one. It's a simple app that logs and lists the referers to all pages in my site. 

## Installation
1. Clone the repository
2. Install [Deno](https://deno.land), either through the steps provided on the website or by running `asdf install` if you have [asdf](https://asdf-vm.com) installed.
3. Copy the `.env.example` file to `.env` and fill in the values
4. Run `deno task deploy` and follow the browser instructions

## Caveats

- There's no CSS, but feel free to add your own
- Data is stored using using [Deno KV](https://docs.deno.com/deploy/kv/manual/). If you care about backups, you'll need to set them up yourself, but [their documentation makes it look easy](https://docs.deno.com/deploy/kv/manual/backup)
- Setting up custom domains is easy, just follow the [documentation](https://docs.deno.com/deploy/manual/custom-domains)
- Deno is free [up to a point](https://deno.com/deploy/pricing), but it's pretty generous and should be enough for most personal sites
