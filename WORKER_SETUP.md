# Cloudflare Worker setup

1. Open Cloudflare Dashboard -> Workers & Pages -> Create.
2. Create a Worker and replace code with contents of `cloudflare-worker.js`.
3. In Worker settings -> Variables, add secrets:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
4. Deploy Worker.
5. Copy Worker URL, for example:
   - `https://wazawai-contact.<subdomain>.workers.dev/contact`
6. In `index.html`, set:
   - `const CONTACT_API_URL = "https://...workers.dev/contact";`
7. Save and publish site.

## Notes

- Keep bot token only in Worker secrets, not in frontend code.
- If your site has a fixed domain, replace `Access-Control-Allow-Origin: *` in worker with your domain.
