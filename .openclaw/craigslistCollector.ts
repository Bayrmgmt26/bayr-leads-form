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
        priority: "normal",
      });
    });

    console.log(`Found ${results.length} posts`);

    const seen = new Set<string>();

for (const lead of results.slice(0, 10)) {
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