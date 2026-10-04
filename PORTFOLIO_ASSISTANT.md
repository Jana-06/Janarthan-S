# Julie website assistant setup

Julie runs on the laptop. Keep the two website routes separate:

| Use | Julie process | Access boundary |
| --- | --- | --- |
| Portfolio visitors | `public_visitor_service.py`, port `5001` | Cloudflare Tunnel; tool-free; fixed public facts only |
| Owner dashboard copilot | `app.py`, port `5000`, `/api/portfolio-draft` | Tailscale Serve; verifies the Supabase owner session; produces drafts only |

Do not expose port `5000` through Cloudflare or point the visitor widget at it.

## 1. Update Supabase

Run the current `supabase/schema.sql` in the Supabase SQL Editor. This updates the `published_feedback` view so all feedback is shown as reviews, with the sender's email excluded. It also leaves project and achievement records publicly readable and owner-only writable. The public form explains that a sender's name and comment will be displayed.

## 2. Configure Julie locally

From the Julie folder, copy any missing non-secret settings from `.env.example` into `.env`:

- `JULIE_SUPABASE_URL`: the project URL.
- `JULIE_SUPABASE_PUBLISHABLE_KEY`: the browser-safe publishable key, never a service-role key.
- `JULIE_OWNER_EMAIL`: the same owner email used by the portfolio's Supabase RLS policies.
- `JULIE_PUBLIC_ORIGINS` and `JULIE_PRIVATE_ORIGINS`: the exact deployed portfolio origin, including `https://` and no path.
- `JULIE_LOCAL_MODEL=ollama/hermes3:8b` and `JULIE_OLLAMA_MODEL=hermes3:8b`.

Configure the one-task key separately with:

```powershell
.\venv\Scripts\python.exe setup_authorization.py
```

Choose a long private phrase. Do not use `god mode`, which has already appeared in conversation. Only its SHA-256 hash is stored. Authorized tasks are not written to persistent chat memory.

For this portfolio, set both origin variables to `https://janarthans.vercel.app` (without a trailing slash).

The Vite endpoint variables in the portfolio `.env.example` are intentionally blank until the public tunnel and private tailnet hostnames exist. This keeps the portfolio assistant controls disabled instead of sending visitor or owner requests to example URLs.

## 3. Start the laptop services

Ollama is already installed with `hermes3:8b`. Start Ollama, then open separate PowerShell windows in the Julie folder:

```powershell
.\venv\Scripts\python.exe app.py
```

```powershell
.\venv\Scripts\python.exe public_visitor_service.py
```

Keep the laptop awake and connected to power and the internet while either website feature needs to run. These commands run in the current login session; Windows sleep, shutdown, or logout stops access. Automatic startup still needs to be configured on the laptop if you want unattended restarts.

## 4. Connect the private owner copilot

Install Tailscale on the laptop and each device you use to administer the portfolio, and sign them into the same tailnet. Run:

```powershell
tailscale serve 5000
```

Copy the HTTPS tailnet hostname reported by Tailscale. In the portfolio hosting provider's build environment set:

```text
VITE_JULIE_PRIVATE_ENDPOINT=https://<laptop-tailnet-hostname>/api/portfolio-draft
```

The admin browser must be on a device connected to the tailnet. Julie verifies the signed-in Supabase access token with Supabase and checks the owner email; the token is not sent to the model. Julie returns a structured draft only. You review and save it through the existing Supabase form and RLS policy.

The Android Julie app uses this same private laptop service for ordinary chat. Install Tailscale on the phone, join the same tailnet, then enter the laptop's HTTPS `*.ts.net` origin in Julie's Settings. Phone app-opening commands run on Android; other questions go to the local laptop model. One-task elevation is entered in Julie's obscured key prompt and sent only with the next voice request.

## 5. Connect the public visitor bot

Create a dedicated Cloudflare Tunnel hostname targeting `http://127.0.0.1:5001`. For a temporary local trial, `cloudflared tunnel --url http://127.0.0.1:5001` creates a temporary hostname; it changes between runs and is not a stable production address. Set the stable hostname in the portfolio hosting provider's build environment:

```text
VITE_JULIE_PUBLIC_ENDPOINT=https://<public-assistant-hostname>/api/chat
```

Set `JULIE_PUBLIC_ORIGINS` to the exact portfolio website origin. Rebuild and redeploy the Vite app after changing either `VITE_JULIE_*` setting. Visitor prompts and short conversation history are sent to the local model but are not stored by the visitor service. Its in-memory request limits reset when it restarts.

## 6. Gmail and accuracy feedback

Complete the OAuth steps in Julie's `LOCAL_ACCESS.md`. Until OAuth is configured, the Gmail tools return a setup message. Replies require the one-task key and an address explicitly enabled in the local `people.json` file.

Julie records task duration, tool-call count, and optional helpfulness ratings in the local `.julie_metrics.jsonl` file. It does not include prompts, message bodies, the task key, or Gmail contents. This is an initial feedback signal, not an independently measured accuracy score.

The public portfolio widget is informational only. It cannot access Gmail, private memory, files, or tools. Social-platform actions and unattended auto-replies are not configured in this version.
