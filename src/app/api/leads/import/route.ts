import { NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const docRef = await addDoc(collection(db, "leads"), {
      leadName: body.leadName || "",
      source: body.source || "Website Form",
      serviceRequested: body.serviceRequested || "",
      phone: body.phone || "",
      email: body.email || "",
      location: body.location || "",
      urgency: body.urgency || "Normal",
      estimatedValue: body.estimatedValue || "Medium",
      notes: body.notes || "",
      status: "new",
      createdAt: serverTimestamp()
    });

    return NextResponse.json({
      success: true,
      id: docRef.id
    });

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}