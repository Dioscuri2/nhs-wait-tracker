#!/usr/bin/env python3
"""
ShorterWait — Load NHS wait times into Supabase.
Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... python3 load_to_supabase.py wait_times.json
"""

import json
import os
import sys
import urllib.request
import urllib.parse

WAIT_TIMES_FILE = sys.argv[1] if len(sys.argv) > 1 else "wait_times.json"
SUPABASE_URL = os.environ["SUPABASE_URL"].rstrip("/")
SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
BATCH_SIZE = 500


def upsert_batch(rows: list[dict]) -> None:
    payload = json.dumps(rows).encode()
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/wait_times",
        data=payload,
        headers={
            "apikey": SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        if resp.status not in (200, 201):
            raise RuntimeError(f"HTTP {resp.status}: {resp.read().decode()}")


def main():
    print(f"[Load] Reading {WAIT_TIMES_FILE}...", flush=True)
    with open(WAIT_TIMES_FILE) as f:
        data = json.load(f)

    records = data["records"]
    total = len(records)
    print(f"[Load] {total} records to insert", flush=True)

    # Clear existing data first
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/wait_times?id=gt.0",
        headers={
            "apikey": SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        },
        method="DELETE",
    )
    with urllib.request.urlopen(req, timeout=30):
        pass
    print("[Load] Cleared existing wait_times rows", flush=True)

    # Insert in batches
    for i in range(0, total, BATCH_SIZE):
        batch = records[i : i + BATCH_SIZE]
        upsert_batch(batch)
        end = min(i + BATCH_SIZE, total)
        print(f"[Load] Inserted {end}/{total}", flush=True)

    print(f"\n[Done] {total} records loaded into Supabase", flush=True)


if __name__ == "__main__":
    main()
