# ShorterWait — NHS Wait Time Navigator

> Find an NHS hospital with a shorter wait. Right now.

Built by a practising NHS GP. Helps patients exercise their legal right to choose a provider with a shorter wait.

## What it does

- Search by postcode + specialty → ranked hospitals by wait time
- Weekly alerts when wait times drop
- GP insider tips on patient choice rights
- Free tier (2 results) + paid full access (£9.99/month or £15 one-time 90-day)

## Stack

| Layer | Tool |
|---|---|
| Frontend | React + Tailwind CSS (scaffolded via Lovable) |
| Backend/DB | Supabase (your own account — connect in Lovable settings) |
| Scraper | Python + fastCRW + Lightpanda (see **Scraping** below) |
| Email alerts | Resend |
| Billing | Stripe |

## Data

Source: `myplannedcare.nhs.uk` — public NHS planned care wait time data.
Licence: Open Government Licence v3.0 (Crown Copyright, NHS England).
No patient data stored.

- 496 hospitals across 7 NHS regions
- ~3,900 specialty wait time records per scrape
- Trusts update My Planned Care on roughly a monthly cycle, so the scheduled
  scrape runs monthly. **Nothing here promises a refresh cadence to patients:**
  each record carries the trust's own `last_updated` date and the site displays
  it. The site previously claimed "updated weekly" on eight pages while serving
  figures published on 29 May 2026, which a patient disproved by bringing in an
  appointment letter.

### Two wait figures, and they are not interchangeable

My Planned Care publishes two numbers per specialty and the scraper collects
both. They measure different stages and must never be substituted for one
another:

| field | measures |
|---|---|
| `outpatient_avg` / `outpatient_8in10` | referral → first appointment |
| `treatment_avg` / `treatment_8in10` | decision to operate → the operation |

Showing the second where a patient asked about the first told a GP that a
hiatus hernia repair at King's Lynn was a 10-week wait while his patient held
a 50-week appointment letter. Either may be `null` where a trust does not
publish it; `null` means "not published", never "short".

## Scraping

This is a **terminal job**, run from the machine where fastCRW lives. There is
no schedule, and that is deliberate — see below.

```bash
export FASTCRW_API_KEY=...                     # required
export FASTCRW_ENDPOINT=http://127.0.0.1:3000  # optional, this is the default

./scraper/run-local.sh --check   # is fastCRW alive? seconds, no scrape
./scraper/run-local.sh           # scrape, validate, stage the result
```

`--check` answers "is this still working?" without committing to 25 minutes.
The full run scrapes ~496 hospitals at a 2.5s delay, checks the result against
the published file, and stages it. **It does not commit** — that is yours to
decide, and the script prints the commands.

The scraper needs **fastCRW + Lightpanda** reachable at `FASTCRW_ENDPOINT`,
because My Planned Care sits behind Cloudflare and plain requests are blocked.

### Why there is no cron

A GitHub-hosted runner has nothing at `127.0.0.1:3000`, so a schedule would
fire, fail, and send a failure email every time. That is why
`.github/workflows/scrape-wait-times.yml` is `workflow_dispatch` only. It is
kept for the day fastCRW is reachable from CI — a hosted endpoint in
`FASTCRW_ENDPOINT`, or a self-hosted runner on the fastCRW machine with
`runs-on` changed to its label. Add `schedule:` back then, and not before.

Every run is checked by `scraper/validate_scrape.py` before anything is
committed. A Cloudflare block returns pages that parse cleanly and contain
nothing, so a "successful" scrape can null every figure on the live site
without erroring. The guard rejects a scrape that loses more than 20% of its
records or hospitals, errors on more than 10% of pages, or leaves more than
35% of records with no figures at all — and the existing data stays put.

> **Rotate the fastCRW key.** It was committed as a literal in
> `scraper/scraper.py` in this public repository on 31 May 2026 and sat there
> until it was moved to the environment. It is still in the git history, so
> treat it as compromised and issue a new one.

## Supabase setup

1. Create a project at supabase.com (free tier is fine to start)
2. Run `SCHEMA.sql` in the Supabase SQL editor
3. In Lovable: Settings → Supabase → paste your project URL + anon key

## Specialty naming — important

The frontend dropdown must use exact NHS specialty names.
See `SCHEMA.sql` → `specialty_map` table.
Key fix: use **"Ear, Nose and Throat"** not "ENT".

## Domains
- Primary: shorterwait.org
- Backup: 18weeks.org

## Legal
- Public administrative data only — no patient records
- "Not medical advice. Always consult your GP." on every page
- Operate as a limited company; ICO registration required (£40/year)
- Open Government Licence attribution in footer
