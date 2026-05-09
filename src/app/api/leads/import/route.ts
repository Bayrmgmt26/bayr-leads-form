import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/leads?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            leadName: { stringValue: body.leadName || "" },
            source: { stringValue: body.source || "Website Form" },
            serviceRequested: { stringValue: body.serviceRequested || "" },
            phone: { stringValue: body.phone || "" },
            email: { stringValue: body.email || "" },
            location: { stringValue: body.location || "" },
            urgency: { stringValue: body.urgency || "Normal" },
            estimatedValue: { stringValue: body.estimatedValue || "Medium" },
            notes: { stringValue: body.notes || "" },
            status: { stringValue: "new" },
            createdAt: { timestampValue: new Date().toISOString() },
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.name,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}