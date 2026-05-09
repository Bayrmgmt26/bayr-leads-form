import { NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Incoming body:", body);

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
      createdAt: serverTimestamp(),
    });

    console.log("Lead saved:", docRef.id);

    return NextResponse.json({
      success: true,
      id: docRef.id
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