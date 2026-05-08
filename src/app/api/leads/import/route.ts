import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      leadName,
      source,
      serviceRequested,
      phone,
      email,
      location,
      urgency,
      estimatedValue,
      notes
    } = body;

    const docRef = await addDoc(collection(db, "leads"), {
      leadName,
      source,
      serviceRequested,
      phone,
      email: email || "",
      location,
      urgency,
      estimatedValue,
      notes,
      createdAt: serverTimestamp(),
      status: "new"
    });

    return NextResponse.json({
      success: true,
      leadId: docRef.id
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}