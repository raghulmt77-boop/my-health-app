# My Health App — Database Edition

This project uses:
- HTML/CSS/JavaScript frontend
- Supabase Auth for account sign-in/sign-up
- Supabase PostgreSQL for persistent health-note storage
- Row Level Security (RLS) so each user can access only their own rows

## Setup

1. Create a Supabase project at https://supabase.com/.
2. In Supabase, open **SQL Editor**, create a query, paste `schema.sql`, and run it.
3. Open **Project Settings → API** and copy the Project URL and publishable/anon key.
4. Paste those two values into `config.js`.
   - Use only the public publishable/anon key in frontend code.
   - Never put a `service_role` or secret key in `config.js`.
5. Open `index.html` in a local web server (for example, VS Code Live Server), or deploy the files to Vercel.
6. Create an account, sign in, save a test note, refresh the page, and confirm the note remains.
7. Test with a second account to confirm it cannot see the first account's records.

## Deploying to Vercel

Deploy the folder as a static site. `index.html`, `style.css`, `app.js`, and `config.js` should be at the project root. If you later switch to a build system, keep the Supabase public URL/key in environment-specific public configuration.

## Health data warning

This is a starter personal-note app, not a clinically validated system or a compliance certification. Do not store real patient records until you have reviewed applicable privacy laws, access controls, retention, backups, incident response, and any healthcare compliance requirements relevant to your use.
