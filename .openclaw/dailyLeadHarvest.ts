import { collectCraigslistLeads } from "./craigslistCollector.ts";

async function runDailyHarvest() {
  console.log("Daily lead harvest started...");
  await collectCraigslistLeads();
  console.log("Daily lead harvest completed.");
}

runDailyHarvest().catch(console.error);