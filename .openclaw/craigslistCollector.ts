import * as cheerio from "cheerio";
import { saveLeadToFirestore } from "./src/lib/firestoreLeadWrite";
import { leadSources } from "./leadSources";

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 BayrLeadBot/1.0",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }

  return await res.text();
}

export async function collectCraigslistLeads() {
  for (const source of leadSources) {
    console.log(`Checking: ${source.name}`);

    const html = await fetchHtml(source.url);
    const $ = cheerio.load(html);

    const results: any[] = [];

    $(".cl-static-search-result").each((_, el) => {
      const title = $(el).find(".title").text().trim();
      const link = $(el).find("a").attr("href") || source.url;
      const location = $(el).find(".location").text().trim() || source.location;
      const price = $(el).find(".price").text().trim();

      if (!title) return;

      results.push({
  customerName: "Craigslist Lead",
  phone: "",
  email: "",
  service: source.serviceType,
  location,
  notes: `${title}${price ? ` | ${price}` : ""} | ${link}`,
  source: source.name,
  sourceUrl: link,

  priority: scoreLead({
    notes: title,
    service: source.serviceType,
    location,
  }),
});
    });
function scoreLead(lead: any) {
  const text = `${lead.notes} ${lead.service} ${lead.location}`.toLowerCase();

  let score = 50;

  if (text.includes("drywall")) score += 30;
  if (text.includes("repair")) score += 20;
  if (text.includes("cleaning")) score += 20;
  if (text.includes("move-out")) score += 25;
  if (text.includes("junk")) score += 20;
  if (text.includes("paint")) score += 15;
  if (text.includes("handyman")) score += 15;

  if (text.includes("philadelphia")) score += 10;
  if (text.includes("chester")) score += 10;
  if (text.includes("delaware county")) score += 10;

  if (score >= 85) return "hot";
  if (score >= 65) return "warm";
  return "low";
}
    console.log(`Found ${results.length} posts`);
const filteredResults = results.filter((lead) => {
  const text = `${lead.notes} ${lead.service}`.toLowerCase();

  const blacklist = [
    "wayfair",
    "employment",
    "hiring",
    "career",
    "job opening",
    "full time",
    "part time",
    "recruiter",
    "salary",
    "hourly",
    "assemble furniture"
  ];

  return !blacklist.some(word => text.includes(word));
});
    const seen = new Set<string>();

for (const lead of filteredResults.slice(0, 10)) {
  const key = `${lead.sourceUrl || ""}-${lead.notes || ""}`;

  if (seen.has(key)) {
    console.log("Skipped duplicate in this run:", lead.notes);
    continue;
  }

  seen.add(key);
  await saveLeadToFirestore(lead);
}
  }
  console.log("Craigslist collection completed.")
}