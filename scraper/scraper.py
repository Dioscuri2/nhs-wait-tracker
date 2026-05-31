#!/usr/bin/env python3
"""
ShorterWait — NHS Wait Times Scraper
Scrapes myplannedcare.nhs.uk weekly via local fastCRW + Lightpanda stack.
Outputs JSON; pipe to Supabase via load_to_supabase.py

Data licence: Open Government Licence v3.0
Source: Crown Copyright, NHS England
"""

import json
import sys
import time
import urllib.request
import re
from datetime import datetime, timezone
from bs4 import BeautifulSoup

FASTCRW_ENDPOINT = "http://127.0.0.1:3000"
FASTCRW_API_KEY  = "fc-key-trolley-roast-secret-123"
INDEX_URL        = "https://www.myplannedcare.nhs.uk/find-my-hospital/"
OUTPUT_FILE      = "wait_times.json"
DELAY_SECONDS    = 2.5


def scrape_page(url: str) -> str:
    payload = json.dumps({"url": url, "formats": ["html"], "renderer": "lightpanda"}).encode()
    req = urllib.request.Request(
        f"{FASTCRW_ENDPOINT}/v1/scrape", data=payload,
        headers={"Authorization": f"Bearer {FASTCRW_API_KEY}",
                 "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())["data"]["html"]


def extract_hospital_urls(html: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    pattern = re.compile(
        r"^https://www\.myplannedcare\.nhs\.uk/(london|nwest|ney|mids|east|seast|swest)/[^/]+/$"
    )
    seen, urls = set(), []
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if pattern.match(href) and href not in seen:
            seen.add(href); urls.append(href)
    return urls


def parse_weeks(text: str):
    if not text: return None
    t = text.strip().lower()
    if t in ("n/a", "na", "-", ""): return None
    m = re.search(r"[\d.]+", t)
    return float(m.group()) if m else None


def parse_hospital_name(soup: BeautifulSoup) -> str:
    for img in soup.find_all("img", alt=True):
        alt = img.get("alt", "")
        if any(w in alt.lower() for w in ["nhs", "trust", "hospital", "clinic", "centre"]):
            return re.sub(r"\s*logo\s*$", "", alt, flags=re.IGNORECASE).strip()
    h1 = soup.find("h1")
    return h1.get_text(strip=True) if h1 else "Unknown"


def parse_last_updated(soup: BeautifulSoup):
    for li in soup.find_all("li"):
        t = li.get_text(" ", strip=True)
        if "last updated" in t.lower():
            m = re.search(r"\d{1,2}\s+\w+\s+\d{4}", t)
            return m.group() if m else t
    return None


def parse_specialties(soup: BeautifulSoup) -> list[dict]:
    records = []
    for holder in soup.find_all("div", class_="inner_details_holder"):
        h3 = holder.find("h3", class_="nhsblue-text0")
        if not h3: continue
        specialty = re.sub(r"\s*-\s*Waiting Times\s*$", "", h3.get_text(strip=True), flags=re.IGNORECASE)
        out_avg = out_8 = tr_avg = tr_8 = None
        for table in holder.find_all("table", class_="waiting-times-data"):
            cap = table.find("caption")
            if not cap: continue
            cap_text = cap.get_text(strip=True).lower()
            for row in table.find_all("tr"):
                th = row.find("th"); td = row.find("td")
                if not th or not td: continue
                th_id = th.get("id", ""); val = parse_weeks(td.get_text(strip=True))
                if "outpatient" in cap_text:
                    if th_id.startswith("First_Av_Wait") or "average" in th.get_text().lower(): out_avg = val
                    elif "8 in 10" in th.get_text().lower(): out_8 = val
                elif "treatment" in cap_text:
                    if th_id.startswith("Av_Wait") or "average" in th.get_text().lower(): tr_avg = val
                    elif "8 in 10" in th.get_text().lower(): tr_8 = val
        records.append({"specialty": specialty, "outpatient_avg": out_avg, "outpatient_8in10": out_8,
                        "treatment_avg": tr_avg, "treatment_8in10": tr_8})
    return records


def run():
    print("[Phase 1] Fetching hospital index...", flush=True)
    hospital_urls = extract_hospital_urls(scrape_page(INDEX_URL))
    print(f"[Phase 1] Found {len(hospital_urls)} hospital URLs", flush=True)

    all_records, errors = [], []
    print("[Phase 2] Scraping hospital pages...", flush=True)
    for i, url in enumerate(hospital_urls, 1):
        print(f"  [{i}/{len(hospital_urls)}] {url}", flush=True)
        try:
            html = scrape_page(url)
            if "cf-error-details" in html or "banned" in html:
                raise RuntimeError("Cloudflare block")
            soup = BeautifulSoup(html, "html.parser")
            name = parse_hospital_name(soup)
            region = url.rstrip("/").split("/")[-2]
            last_updated = parse_last_updated(soup)
            scraped_at = datetime.now(timezone.utc).isoformat()
            for spec in parse_specialties(soup):
                all_records.append({"hospital_name": name, "hospital_url": url, "region": region,
                                    "last_updated": last_updated, "scraped_at": scraped_at, **spec})
            print(f"    → {len(parse_specialties(soup))} specialties", flush=True)
        except Exception as e:
            print(f"    ! ERROR: {e}", flush=True)
            errors.append({"url": url, "error": str(e)})
        if i < len(hospital_urls):
            time.sleep(DELAY_SECONDS)

    output = {"scraped_at": datetime.now(timezone.utc).isoformat(),
              "total_records": len(all_records), "total_errors": len(errors),
              "errors": errors, "records": all_records}
    with open(OUTPUT_FILE, "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    print(f"\n[Done] {len(all_records)} records → {OUTPUT_FILE}", flush=True)
    if errors:
        print(f"[Errors] {len(errors)} failures — see errors key in output", flush=True)


if __name__ == "__main__":
    run()
