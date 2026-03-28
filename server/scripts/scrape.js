const axios = require('axios');
const cheerio = require('cheerio');
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../db/fridgetofit.db');
const DELAY_MS = 300;

const BASE = 'https://www.curiouscuisiniere.com';

// Category pages to crawl (with cuisine hints)
const CATEGORIES = [
  { url: `${BASE}/africa/`, cuisine: 'african' },
  { url: `${BASE}/asia/`, cuisine: 'asian' },
  { url: `${BASE}/australia/`, cuisine: 'australian' },
  { url: `${BASE}/europe/`, cuisine: 'european' },
  { url: `${BASE}/north-america/`, cuisine: 'american' },
  { url: `${BASE}/south-america/`, cuisine: 'south american' },
  { url: `${BASE}/food/appetizers-and-snacks/`, cuisine: null },
  { url: `${BASE}/food/bread-recipe/`, cuisine: null },
  { url: `${BASE}/food/breakfast-and-brunch/`, cuisine: null },
  { url: `${BASE}/food/main-dishes/`, cuisine: null },
  { url: `${BASE}/food/side-dishes/`, cuisine: null },
  { url: `${BASE}/food/soup-and-stew/`, cuisine: null },
  { url: `${BASE}/food/dessert/`, cuisine: null },
  { url: `${BASE}/food/drinks/`, cuisine: null },
  { url: `${BASE}/food/sauces-jams-and-condiments/`, cuisine: null },
  { url: `${BASE}/cooking-with-kids/`, cuisine: null },
  { url: `${BASE}/seasonal/winter/`, cuisine: null },
  { url: `${BASE}/seasonal/spring/`, cuisine: null },
  { url: `${BASE}/seasonal/summer/`, cuisine: null },
  { url: `${BASE}/seasonal/fall/`, cuisine: null },
  { url: `${BASE}/holiday/thanksgiving/`, cuisine: null },
  { url: `${BASE}/holiday/christmas/`, cuisine: null },
  { url: `${BASE}/holiday/chinese-new-year/`, cuisine: 'chinese' },
  { url: `${BASE}/holiday/easter/`, cuisine: null },
  { url: `${BASE}/holiday/halloween/`, cuisine: null },
  { url: `${BASE}/holiday/mardi-gras/`, cuisine: null },
  { url: `${BASE}/holiday/ramadan/`, cuisine: null },
  { url: `${BASE}/holiday/st-patricks-day/`, cuisine: 'irish' },
];

// --- DB SETUP ---
const db = new Database(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cuisine_tag TEXT,
    ingredient_list TEXT,
    prep_time_min INTEGER,
    instructions_url TEXT UNIQUE,
    image_url TEXT
  );
`);

const insert = db.prepare(`
  INSERT OR IGNORE INTO recipes (name, cuisine_tag, ingredient_list, prep_time_min, instructions_url, image_url)
  VALUES (@name, @cuisine_tag, @ingredient_list, @prep_time_min, @instructions_url, @image_url)
`);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRecipeUrl(url) {
  // Recipe URLs are single-segment root-level: /slug/ (not /food/xxx/ or /category/xxx/)
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    return parts.length === 1;
  } catch (_) { return false; }
}

function parsePrepTime(text) {
  if (!text) return null;
  text = text.toLowerCase();
  let total = 0;
  const hours = text.match(/(\d+)\s*h(our|r)?s?/);
  const mins = text.match(/(\d+)\s*m(in|inute)?s?/);
  if (hours) total += parseInt(hours[1]) * 60;
  if (mins) total += parseInt(mins[1]);
  return total > 0 ? total : null;
}

function fallbackPrepTime(n) {
  if (n <= 5) return 15;
  if (n <= 10) return 25;
  return 40;
}

async function get(url) {
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FridgeToFit/1.0)' },
    timeout: 15000,
  });
  return data;
}

// --- STEP 1: CRAWL CATEGORY PAGES ---
async function getRecipeUrls() {
  console.log('Crawling category pages...');
  const urlToCuisine = new Map(); // url → cuisine hint

  for (const cat of CATEGORIES) {
    let pageUrl = cat.url;
    let pageNum = 1;

    while (pageUrl) {
      await sleep(DELAY_MS);
      try {
        const html = await get(pageUrl);
        const $ = cheerio.load(html);

        $('article a[href], .entry-title a, h2.entry-title a, h3.entry-title a').each((_, el) => {
          const href = $(el).attr('href');
          if (href && href.includes('curiouscuisiniere.com') && isRecipeUrl(href)) {
            const clean = href.split('?')[0].split('#')[0];
            if (!urlToCuisine.has(clean)) {
              urlToCuisine.set(clean, cat.cuisine);
            }
          }
        });

        // Pagination
        const nextPage = $('a.next, .nav-links a.next').attr('href');
        pageUrl = nextPage && nextPage.includes('curiouscuisiniere.com') ? nextPage : null;
        pageNum++;
        if (pageNum > 20) break; // safety limit
      } catch (err) {
        console.error(`ERROR crawling ${pageUrl}: ${err.message}`);
        break;
      }
    }
    process.stdout.write('.');
  }

  console.log(`\nFound ${urlToCuisine.size} unique recipe URLs.`);
  return urlToCuisine;
}

// --- STEP 2: SCRAPE RECIPE ---
async function scrapeRecipe(url, cuisineHint) {
  const html = await get(url);
  const $ = cheerio.load(html);

  const name = $('h1').first().text().trim() || 'Unknown';

  // cuisine_tag: hint from category > breadcrumb > url
  let cuisine_tag = cuisineHint || '';
  if (!cuisine_tag) {
    const crumbs = $('.breadcrumbs a, .breadcrumb a, nav.breadcrumb a')
      .map((_, el) => $(el).text().trim().toLowerCase()).get()
      .filter(c => c && c !== 'home');
    cuisine_tag = crumbs[0] || '';
  }
  if (!cuisine_tag) {
    // infer from first non-trivial path segment
    const slug = new URL(url).pathname.split('/').filter(Boolean)[0] || '';
    cuisine_tag = slug.replace(/-/g, ' ');
  }
  cuisine_tag = (cuisine_tag || 'global').trim().toLowerCase();

  // ingredient_list
  const ingredients = [];
  $('.wprm-recipe-ingredient, .ingredient, ul.ingredients li').each((_, el) => {
    const text = $(el).text().trim();
    if (text) ingredients.push(text);
  });

  // prep_time_min
  let prep_time_min = null;
  let usedFallback = false;

  // Strategy 1a — wprm containers
  const prepEl = $('.wprm-recipe-prep-time-container, .wprm-recipe-total-time-container').first();
  if (prepEl.length) prep_time_min = parsePrepTime(prepEl.text());

  // Strategy 1b — generic time classes
  if (!prep_time_min) {
    $('[class*="prep-time"], [class*="preptime"], [class*="total-time"]').each((_, el) => {
      if (prep_time_min) return;
      prep_time_min = parsePrepTime($(el).text());
    });
  }

  // Strategy 1c — body text scan
  if (!prep_time_min) {
    const bodyText = $('body').text();
    const m = bodyText.match(/(?:prep|total)\s*time[:\s]+([0-9hHmM \w]+?)(?:\n|<|\.|,|$)/i);
    if (m) prep_time_min = parsePrepTime(m[1]);
  }

  // Strategy 2 — fallback
  if (!prep_time_min) {
    prep_time_min = fallbackPrepTime(ingredients.length);
    usedFallback = true;
  }

  const image_url = $('meta[property="og:image"]').attr('content') || '';

  return { name, cuisine_tag, ingredient_list: JSON.stringify(ingredients), prep_time_min, instructions_url: url, image_url, usedFallback };
}

// --- MAIN ---
async function main() {
  const urlToCuisine = await getRecipeUrls();
  const entries = Array.from(urlToCuisine.entries());
  const total = entries.length;

  let inserted = 0;
  let fallbackCount = 0;
  const cuisineCounts = {};

  for (let i = 0; i < total; i++) {
    const [url, cuisineHint] = entries[i];
    await sleep(DELAY_MS);

    try {
      const recipe = await scrapeRecipe(url, cuisineHint);
      const result = insert.run(recipe);

      if (result.changes > 0) {
        inserted++;
        if (recipe.usedFallback) fallbackCount++;
        cuisineCounts[recipe.cuisine_tag] = (cuisineCounts[recipe.cuisine_tag] || 0) + 1;
      }

      if ((i + 1) % 50 === 0) {
        console.log(`Scraped ${i + 1}/${total}...`);
      }
    } catch (err) {
      console.error(`ERROR [${url}]: ${err.message}`);
    }
  }

  console.log('\n========== SCRAPE COMPLETE ==========');
  console.log(`Total recipes inserted: ${inserted}`);
  console.log(`Recipes using fallback prep_time_min: ${fallbackCount}`);
  console.log(`Missing prep_time_min: 0`);
  console.log('\nCuisine tag distribution:');
  const sorted = Object.entries(cuisineCounts).sort((a, b) => b[1] - a[1]);
  for (const [tag, count] of sorted) {
    console.log(`  ${tag}: ${count}`);
  }

  db.close();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
