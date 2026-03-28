# Decisions
_Log architecture decisions here._

## Scraper Edge Cases Fixed (Phase 3)
- **Ingredient selector**: Site uses Mediavine Create plugin (`[class*="ingredient"] li`), not WPRM — added progressive selector fallback chain
- **Empty ingredient_list**: When all selectors return 0 items, store `["ingredients not listed"]` to satisfy ≥1 item constraint
- **Fallback prep_time_min**: Uses real ingredient count (treating "ingredients not listed" as 0) so tiers fire correctly even on empty pages
- **Targeted re-scrape**: Added `--urls=` CLI flag to `scrape.js` for UPDATE-mode re-scrape of specific recipes without full re-run
