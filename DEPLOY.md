# Deploying Naamb (Apsara Creations) on Railway

One Railway service runs everything: the Express API (`ApsaraBackend/ApsaraBackend`) and the
built React site + admin panel (`Apsaraweb`, served at `/` and `/admin`).
`railway.json` and the root `package.json` hold the build/start commands. Health check: `/api/health`.

## Environment variables (Railway → service → Variables)
Never commit real values. Copy them from the current host (Render) dashboard.

| Variable | Needed | What it is |
|---|---|---|
| `MONGO_URI` | yes | MongoDB Atlas connection string |
| `JWT_SECRET` | yes | Long random string used to sign logins. Server refuses to start without it |
| `RAZORPAY_KEY_ID` | yes | Razorpay key id |
| `RAZORPAY_SECRET_KEY` | yes | Razorpay key secret |
| `GOOGLE_CLIENT_ID` | yes | Google OAuth client id (backend check) |
| `VITE_GOOGLE_CLIENT_ID` | yes | Same Google client id, for the website build |
| `VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_TEMPLATE_ID` / `VITE_EMAILJS_PUBLIC_KEY` | yes | Contact form (EmailJS) |
| `UPLOADS_DIR` | yes | `/data/uploads`, with a Railway **volume mounted at `/data`** so uploaded images survive redeploys |
| `RAZORPAY_WEBHOOK_SECRET` | recommended | Enables `/api/payment/webhook` (see below) |
| `CORS_ORIGINS` | optional | e.g. `https://yourdomain.com`. Locks the API to your own site. Leave unset while another front-end still calls this API |

`VITE_API_URL` is already set to `/api` in `Apsaraweb/.env.production`.

## Razorpay webhook (recommended)
If a customer pays and closes the tab before the site confirms, the order would stay "pending".
The webhook fixes that. In the Razorpay Dashboard → Settings → Webhooks → Add:
- URL: `https://<your-domain>/api/payment/webhook`
- Secret: any long random string → put the same value in `RAZORPAY_WEBHOOK_SECRET`
- Events: `payment.captured`, `order.paid`

## After switching domains
- MongoDB Atlas → Network Access: allow `0.0.0.0/0` (Railway has no fixed IP).
- Google Cloud Console → OAuth client → add the new domain to Authorized JavaScript origins.
- Razorpay (live mode) → add the new domain to the website/app settings.

## Creating an admin
```bash
cd ApsaraBackend/ApsaraBackend
ADMIN_USERNAME=... ADMIN_PASSWORD=... MONGO_URI=... node createAdmin.js
```

## Security built in
- Admin / customer JWT checks on every write and order route; customers can only touch their own cart/orders.
- Order prices come from the database; Razorpay signatures checked with constant-time compare; payment marking is idempotent.
- Login/register rate-limited (20 per 15 min per IP); general API limit 300/min.
- MongoDB operator injection stripped from request bodies.
- Uploads: images only (JPG/PNG/WEBP/GIF/AVIF), 5 MB max, random file names.
- Public reviews never expose reviewers' phone/email (admin-only endpoint has them).
- Helmet security headers; internal error details never sent to the browser.
