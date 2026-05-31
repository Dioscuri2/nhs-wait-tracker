# ShorterWait — Design System

## Brand
- **Product name:** ShorterWait
- **Domain:** shorterwait.org
- **Tagline:** Find an NHS hospital with a shorter wait. Right now.
- **Voice:** Clinical but human. GP-founded. Plain English. No jargon.

## Colours
```
primary:   #0D6E6E   (teal — trust, health)
secondary: #1A3A4A   (dark navy — authority)
accent:    #00C9A7   (bright teal — CTAs, positive data only)
neutral:   #F4F7F9   (off-white background)
text:      #1C2B36   (near-black body text)
muted:     #6B7C8D   (secondary text, labels)
danger:    #E5534B   (errors, long waits)
```

## Typography
- Font: **Inter** (all weights, via Google Fonts)
- h1: 2.5rem / 700
- h2: 1.75rem / 600
- body: 1rem / 400
- label: 0.875rem / 500

## Spacing
- sm: 8px
- md: 16px
- lg: 32px

## Border radius
- sm: 6px
- md: 12px
- lg: 20px

## Components
| Component | Spec |
|---|---|
| button-primary | bg #00C9A7, text #1A3A4A, radius 12px |
| button-secondary | bg #F4F7F9, text #0D6E6E, radius 12px |
| card | bg white, radius 20px, padding 24px, soft shadow |
| badge-good | bg #E6F9F4, text #0D6E6E |
| badge-warning | bg #FFF4E5, text #B45309 |
| badge-danger | bg #FEE9E8, text #E5534B |

## Design rules
- Mobile-first throughout
- Accent #00C9A7 for primary CTAs and short wait indicators only
- No NHS logo, no NHS blue/white colour scheme
- No stock health imagery
- Generous whitespace — not cluttered
- Soft card shadows, no hard borders
- Skeleton loading states on results
- Disclaimer on every page: "Not medical advice. Always consult your GP."
