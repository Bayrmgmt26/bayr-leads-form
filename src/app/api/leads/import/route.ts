import { NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: Request) {
  try {
    console.log("API hit");

    const body = await req.json();
    console.log("Body received:", body);

    const docRef = await addDoc(collection(db, "leads"), {
      leadName: body.leadName,
      source: body.source,
      serviceRequested: body.serviceRequested,
      phone: body.phone,
      location: body.location,
      urgency: body.urgency,
      estimatedValue: body.estimatedValue,
      notes: body.notes,
      createdAt: serverTimestamp(),
      status: "new"
    });

    console.log("Firestore save success:", docRef.id);

    return NextResponse.json({
      success: true,
      leadId: docRef.id
    });

  } catch (error: any) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}