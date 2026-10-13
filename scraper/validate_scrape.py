#!/usr/bin/env python3
"""
Decide whether a fresh scrape is safe to publish over the current one.

The site reads this repository's wait_times.json directly, so whatever lands
here reaches patients deciding which hospital to be referred to. A scrape can
fail in ways that still produce a well-formed file: My Planned Care sits behind
Cloudflare, and a block returns pages that parse fine and yield nothing. Commit
that and every wait figure on the site becomes null or wrong, quietly.

So a new file replaces the old one only if it is at least as complete. Exits
non-zero with the reason otherwise, and the workflow leaves the good data
alone.

Thresholds are deliberately loose: trusts do stop publishing figures and
hospitals do get reorganised, so this is a guard against collapse, not a test
for exact equality.
"""

import argparse
import json
import sys

# A scrape that lost more than this share of records is treated as broken
# rather than as the NHS having reorganised overnight.
MIN_RECORD_RATIO = 0.80
# Likewise for hospitals: 496 to 470 is plausible, 496 to 100 is a failure.
MIN_HOSPITAL_RATIO = 0.80
# Above this share of hospital pages erroring, the run is not trustworthy even
# if the records it did collect look fine.
MAX_ERROR_RATIO = 0.10
# Every figure null means the tables were not found - the usual shape of a
# silent parse or block failure.
MAX_ALL_NULL_RATIO = 0.35

FIGURES = ("outpatient_avg", "outpatient_8in10", "treatment_avg", "treatment_8in10")


def load(path):
    with open(path) as f:
        return json.load(f)


def summarise(doc):
    recs = doc.get("records") or []
    hospitals = {r.get("hospital_name") for r in recs if r.get("hospital_name")}
    all_null = sum(1 for r in recs if all(r.get(k) is None for k in FIGURES))
    return {
        "records": len(recs),
        "hospitals": len(hospitals),
        "errors": len(doc.get("errors") or []),
        "all_null": all_null,
        "all_null_ratio": (all_null / len(recs)) if recs else 1.0,
        "scraped_at": doc.get("scraped_at"),
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--new", required=True, help="The freshly scraped file.")
    ap.add_argument("--current", help="The committed file to compare against.")
    args = ap.parse_args()

    try:
        new = summarise(load(args.new))
    except (OSError, ValueError) as e:
        print(f"REJECT: new file is unreadable or not JSON: {e}", file=sys.stderr)
        return 1

    print(
        f"new:     {new['records']} records, {new['hospitals']} hospitals, "
        f"{new['errors']} errors, {new['all_null']} rows with no figures "
        f"({new['all_null_ratio']:.0%})"
    )

    problems = []

    if new["records"] == 0:
        problems.append("the scrape produced no records at all")

    # Error rate is measured against hospitals attempted, which is the pages
    # seen plus the ones that failed before yielding any.
    attempted = new["hospitals"] + new["errors"]
    if attempted and new["errors"] / attempted > MAX_ERROR_RATIO:
        problems.append(
            f"{new['errors']} of {attempted} hospital pages failed "
            f"({new['errors'] / attempted:.0%}, limit {MAX_ERROR_RATIO:.0%}) - "
            "this is what a Cloudflare block looks like"
        )

    if new["all_null_ratio"] > MAX_ALL_NULL_RATIO:
        problems.append(
            f"{new['all_null_ratio']:.0%} of records carry no figures at all "
            f"(limit {MAX_ALL_NULL_RATIO:.0%}) - the waiting-time tables were "
            "probably not found on the page"
        )

    if args.current:
        try:
            cur = summarise(load(args.current))
        except (OSError, ValueError):
            print("No readable current file; publishing the new one on its own merits.")
            cur = None
        if cur and cur["records"]:
            print(
                f"current: {cur['records']} records, {cur['hospitals']} hospitals, "
                f"scraped {cur['scraped_at']}"
            )
            rr = new["records"] / cur["records"]
            hr = new["hospitals"] / cur["hospitals"] if cur["hospitals"] else 1.0
            if rr < MIN_RECORD_RATIO:
                problems.append(
                    f"records fell to {rr:.0%} of the current file "
                    f"({new['records']} from {cur['records']}, floor {MIN_RECORD_RATIO:.0%})"
                )
            if hr < MIN_HOSPITAL_RATIO:
                problems.append(
                    f"hospitals fell to {hr:.0%} of the current file "
                    f"({new['hospitals']} from {cur['hospitals']}, floor {MIN_HOSPITAL_RATIO:.0%})"
                )

    if problems:
        print("\nREJECT - keeping the current data:", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        print(
            "\nThe existing figures stay in place. Stale data is bad; silently "
            "wrong data on a page telling patients which hospital is quicker is "
            "worse.",
            file=sys.stderr,
        )
        return 1

    print("\nACCEPT - the new scrape is at least as complete as the current one.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
