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
| Scraper | Python + fastCRW + Lightpanda (local Docker) |
| Email alerts | Resend |
| Billing | Stripe |

## Data

Source: `myplannedcare.nhs.uk` — public NHS planned care wait time data.
Licence: Open Government Licence v3.0 (Crown Copyright, NHS England).
Updated weekly. No patient data stored.

- 496 hospitals across 7 NHS regions
- 3,900+ specialty wait time records per weekly scrape
- Refreshed every Monday after NHS publishes weekly update

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
