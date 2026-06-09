import { saveLeadToFirestore } from "./src/lib/firestoreLeadWrite";

async function run() {
  await saveLeadToFirestore({
    customerName: "Test Lead",
    phone: "555-555-5555",
    service: "Drywall repair",
    city: "Chester",
    source: "openclaw-test",
  });
}

run();