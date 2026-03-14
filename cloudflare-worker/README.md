# Don Tachi Publish Worker

This free Cloudflare Worker lets `owner-editor.html` publish menu data without exposing GitHub credentials in the browser.

## What it does

1. Receives menu JSON from the editor
2. Verifies a simple publish password
3. Saves the menu in Cloudflare KV
4. Serves the published menu from `GET /menu`

## One-time setup

1. Install Wrangler:
   `npm install -g wrangler`
2. In this folder run:
   `wrangler login`
3. Create a KV namespace:
   `wrangler kv namespace create MENU_KV`
4. Copy the returned KV ids into `wrangler.toml` (`id` and `preview_id`)
5. Set the owner publish password:
   `wrangler secret put PUBLISH_PASSWORD`
6. Deploy:
   `wrangler deploy`
7. Copy the deployed Worker URL
8. Put that URL into `DonTachi/publish-config.json` as `endpointUrl`

## Notes

- The owner only needs the publish password.
- The public menu reads from the Worker endpoint when configured.
- Restrict `ALLOWED_ORIGIN` in `wrangler.toml` to your GitHub Pages origin.
