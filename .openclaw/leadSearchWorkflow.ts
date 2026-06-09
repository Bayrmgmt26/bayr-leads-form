import { saveLeadToFirestore } from "./src/lib/firestoreLeadWrite";
import { leadSources } from "./leadSources";

async function runLeadWorkflow() {
  for (const source of leadSources) {
    await saveLeadToFirestore({
      customerName: "Lead source check",
      phone: "",
      email: "",
      service: source.serviceType,
      location: source.location,
      notes: `Search this source: ${source.url}`,
      source: source.name,
      priority: "normal",
    });
  }

  console.log("Lead source workflow completed.");
}

runLeadWorkflow();