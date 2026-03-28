# GitHub Pages Deploy

Final site URL:

https://suckthefystem.github.io/DonTachiMenu/

## What this repo now includes

- GitHub Pages workflow at `.github/workflows/deploy-pages.yml`
- Site files deployed from the `DonTachi/` folder
- QR image at `DonTachi/qr-code-styled.png`
- Canonical QR page at `DonTachi/qr/index.html`
- Legacy `DonTachi/qr-card.html` now redirects to `DonTachi/qr/`
- Owner editor in `DonTachi/owner-editor.html`
- Free publish backend in `cloudflare-worker/`
- Publish config in `DonTachi/publish-config.json`

## What to do on GitHub

1. Push the `.github/workflows/deploy-pages.yml` file to the `main` branch.
2. Open the GitHub repo settings.
3. Go to Pages.
4. Under Source, select `GitHub Actions`.
5. Wait for the `Deploy GitHub Pages` workflow to finish.
6. Open the live URL and verify the menu loads.

## Publishing menu changes live

1. Open `DonTachi/owner-editor.html` in browser.
2. Edit the menu.
3. Click `Publish Live`.
4. Enter the simple publish password when prompted.
5. Wait for success message.
6. Refresh the live site.

## One-time backend setup

1. Open `cloudflare-worker/README.md`.
2. Deploy the Cloudflare Worker.
3. Copy the Worker URL.
4. Put that URL into `DonTachi/publish-config.json` as `endpointUrl`.
5. Push that file to the repo.

## Notes

- Because the site is deployed from the `DonTachi/` folder, the workflow publishes that folder directly.
- If the site still shows 404 right after enabling Pages, wait 1-2 minutes and refresh.
- The public menu reads from the Worker endpoint (`/menu`) when configured.
- `Reload Published Menu` in the editor reloads the current published menu.
- `Publish Live` sends the menu to the Cloudflare Worker, which stores it in KV.
