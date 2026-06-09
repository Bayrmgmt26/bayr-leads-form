import admin from "firebase-admin";
import serviceAccount from "../../serviceaccountkey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      serviceAccount as admin.ServiceAccount
    ),
  });
}

const db = admin.firestore();

export async function saveLeadToFirestore(lead: any) {
  const existing = await db
    .collection("leads")
    .where("sourceUrl", "==", lead.sourceUrl || "")
    .limit(1)
    .get();

  if (!existing.empty && lead.sourceUrl) {
    console.log("Skipped existing Firestore lead:", lead.sourceUrl);
    return existing.docs[0].id;
  }

  const docRef = await db.collection("leads").add({
    ...lead,
    status: "new",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("Lead saved to Firestore:", docRef.id);
  return docRef.id;
}