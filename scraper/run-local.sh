#!/usr/bin/env bash
# Run the wait-times scrape from your own machine.
#
# The scraper needs fastCRW + Lightpanda, because My Planned Care sits behind
# Cloudflare and plain requests are blocked. That stack runs locally, so this
# is a terminal job rather than a scheduled one.
#
#   ./scraper/run-local.sh --check    is fastCRW alive? (seconds, no scrape)
#   ./scraper/run-local.sh            full scrape, validate, stage the result
#
# Nothing is committed and nothing replaces the published file until the new
# scrape has been checked against it. On rejection the new file is kept so you
# can look at what came back.

set -euo pipefail

cd "$(dirname "$0")/.."

ENDPOINT="${FASTCRW_ENDPOINT:-http://127.0.0.1:3000}"
CURRENT="scraper/wait_times.json"
NEW="scraper/wait_times.new.json"

say() { printf '\n%s\n' "$*"; }

check_endpoint() {
  say "fastCRW endpoint: $ENDPOINT"
  if curl -fsS --max-time 10 -o /dev/null "$ENDPOINT" 2>/dev/null; then
    echo "  reachable."
    return 0
  fi
  cat >&2 <<EOF
  NOT reachable.

  Nothing answered at $ENDPOINT. Usually that means the fastCRW +
  Lightpanda stack is not running. Start it, then run this again.

  If it now lives somewhere else:
      export FASTCRW_ENDPOINT=http://host:port
EOF
  return 1
}

if [ "${1:-}" = "--check" ]; then
  check_endpoint
  if [ -z "${FASTCRW_API_KEY:-}" ]; then
    echo "  FASTCRW_API_KEY is not set in this shell (needed for a real scrape)." >&2
    exit 1
  fi
  echo "  FASTCRW_API_KEY is set."
  exit 0
fi

if [ -z "${FASTCRW_API_KEY:-}" ]; then
  cat >&2 <<'EOF'

FASTCRW_API_KEY is not set. Refusing to start: without it every request is
rejected and ~500 pages of nulls would come back.

    export FASTCRW_API_KEY=...

The key that used to be committed in scraper/scraper.py is public in this
repo's git history. Issue a new one rather than reusing it.
EOF
  exit 1
fi

check_endpoint

say "Scraping. ~496 hospitals at a 2.5s delay, so this takes 25 minutes or more."
python3 scraper/scraper.py --output "$NEW"

say "Checking the new scrape against the published one."
if ! python3 scraper/validate_scrape.py --new "$NEW" --current "$CURRENT"; then
  cat >&2 <<EOF

Rejected. The published figures are untouched.

The new file is kept at $NEW so you can see what came back. A Cloudflare
block is the usual cause and it looks like success: pages parse cleanly and
contain nothing.
EOF
  exit 1
fi

mv "$NEW" "$CURRENT"

if git diff --quiet -- "$CURRENT"; then
  say "Scrape succeeded and matched the published file. Nothing to commit."
  exit 0
fi

say "Accepted and staged. The figures changed:"
git diff --stat -- "$CURRENT"
cat <<'EOF'

Not committed - that is your call. To publish:

    git add scraper/wait_times.json
    git commit -m "Refresh NHS wait times"
    git push

shorterwait.org picks it up on its next sync.
EOF
