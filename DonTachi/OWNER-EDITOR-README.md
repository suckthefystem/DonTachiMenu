# Owner Editor Workflow

This is the main owner workflow.

## How it works

1. `owner-editor.html` loads the current published menu
2. Owner edits the menu visually
3. `Publish Live` sends the menu to the Cloudflare Worker
4. The Worker stores the menu in Cloudflare KV
5. `index.html` reads the published menu from the Worker endpoint

## Files involved

- `owner-editor.html`
- `publish-config.json`
- `../cloudflare-worker/src/index.js`

## One-time setup

1. Deploy the worker in `cloudflare-worker/`
2. Put the worker URL into `publish-config.json`
3. Push changes to GitHub

## Daily owner flow

1. Open `owner-editor.html`
2. Make changes
3. Click `Publish Live`
4. Enter the publish password
