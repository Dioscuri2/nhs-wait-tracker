# CLAUDE.md — nhs-wait-tracker

The NHS wait-times scraper behind **shorterwait.org**. Owned by Olympus Premium
Health Limited; run by Dr Oluwatosin Taiwo, a practising NHS GP.

**This repository is public.** Never commit a key, token or password.

## What matters here

`scraper/wait_times.json` is the file **shorterwait.org syncs its wait figures
from**. Whatever lands in it reaches patients deciding which hospital to be
referred to. That is the whole reason for the care below.

The site itself is a different repository: `Dioscuri2/shorter-wait` (TanStack
Start, deployed via Lovable). Nothing in this repo serves a web page — the
`app/` and `components/` directories are an abandoned Next.js scaffold called
`shorterwait-build`, superseded by that repo. Its Vercel project has failed on
every commit since 31 May 2026 and should be disconnected rather than fixed.

## Running the scrape

```bash
export FASTCRW_API_KEY=...            # required
./scraper/run-local.sh --check        # is fastCRW alive? seconds, no scrape
./scraper/run-local.sh                # scrape, validate, stage
```

It needs **fastCRW + Lightpanda** reachable at `FASTCRW_ENDPOINT` (default
`http://127.0.0.1:3000`), because My Planned Care sits behind Cloudflare and
plain requests are blocked. This is why the scrape is a terminal job on a local
machine and **not** a scheduled CI job: a GitHub runner has nothing on
localhost, so a cron would fail and email a failure every time. That is why
`.github/workflows/scrape-wait-times.yml` is `workflow_dispatch` only. Do not
add a `schedule:` back until fastCRW is reachable from CI.

A full run takes 25 minutes or more: ~496 hospitals at a 2.5s delay.

## Rules that exist because of a real failure

**Never publish a scrape that `validate_scrape.py` rejects, and never weaken
its thresholds to get a run through.** A Cloudflare block returns pages that
parse cleanly and contain nothing, so a scrape can "succeed", write a
well-formed file, and null every wait figure on the live site without erroring
anywhere. The validator rejects a run that loses more than 20% of its records
or hospitals, errors on more than 10% of pages, or leaves more than 35% of
records with no figures. Stale data is bad; silently wrong data on a page
telling patients which hospital is quicker is worse.

**The two wait figures are different stages and neither substitutes for the
other.**

| field | measures |
| --- | --- |
| `outpatient_avg` / `outpatient_8in10` | referral → first appointment |
| `treatment_avg` / `treatment_8in10` | decision to operate → the operation |

They are not summable, neither is a figure for a named procedure, and `null`
means "not published", never "short". Showing the treatment figure where a
patient asked when they would be seen told a GP that a hiatus hernia repair at
King's Lynn was a 10-week wait while his patient held a 50-week appointment
letter. That trust publishes no outpatient figure for Upper GI at all.

**Never promise a refresh cadence** anywhere that reaches a patient. Each
record carries the trust's own `last_updated` date and the site displays it.
The site once claimed "updated weekly" on eight pages while serving figures
published on 29 May 2026.

**The fastCRW key in the git history is burnt.** It was committed as a literal
in `scraper/scraper.py` on 31 May 2026 in this public repo. It is out of the
current file but remains in the history: use a new one, and keep it in the
environment.

## Data licence

Source: `myplannedcare.nhs.uk`. Crown Copyright, NHS England, used under Open
Government Licence v3.0. Credit it. No patient data is stored or scraped.
