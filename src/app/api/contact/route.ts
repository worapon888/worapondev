import { NextResponse } from "next/server";
import { Resend } from "resend";
import type { ContactPayload } from "@/types/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isProd() {
  return process.env.NODE_ENV === "production";
}

export async function POST(req: Request) {
  // --- Parse JSON ---
  let body: ContactPayload | null = null;
  try {
    body = (await req.json()) as ContactPayload;
  } catch (e) {
    console.error("[/api/contact] Invalid JSON:", e);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  console.log("[/api/contact] body:", body);
  // --- Honeypot ---
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // --- Validate ---
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in name, email, and message." },
      { status: 400 },
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }
  if (name.length > 80) {
    return NextResponse.json({ error: "Name is too long." }, { status: 400 });
  }
  if (message.length > 4000) {
    return NextResponse.json(
      { error: "Message is too long." },
      { status: 400 },
    );
  }

  // --- ENV ---
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "Worapon.dev <onboarding@resend.dev>";

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY" },
      { status: 500 },
    );
  }
  if (!to) {
    return NextResponse.json(
      { error: "Missing CONTACT_TO_EMAIL" },
      { status: 500 },
    );
  }

  // --- Send ---
  try {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br/>");

    const subject = `New Contact — ${name}`;

    const payload: any = {
      from,
      to,
      subject,
      html: `
        <div style="font-family: ui-sans-serif, system-ui; line-height: 1.6">
          <h2 style="margin: 0 0 12px">New Contact Message</h2>
          <p style="margin: 0 0 6px"><b>Name:</b> ${safeName}</p>
          <p style="margin: 0 0 6px"><b>Email:</b> ${safeEmail}</p>
          <p style="margin: 16px 0 6px"><b>Message:</b></p>
          <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 10px">
            ${safeMessage}
          </div>
          <p style="margin-top: 16px; color: #6b7280; font-size: 12px">
            Sent from your website contact form.
          </p>
        </div>
      `,
      // ใส่ได้ทั้งสองแบบ กัน SDK/typing ต่างเวอร์ชัน
      replyTo: email,
      reply_to: email,
    };

    const result = await resend.emails.send(payload);

    // ✅ ถ้ามี error จริงจะเห็นตรงนี้
    if ((result as any)?.error) {
      console.error("[Resend] send error:", (result as any).error, {
        from,
        to,
      });

      // dev mode: ส่งรายละเอียดกลับไปดูใน Postman
      if (!isProd()) {
        return NextResponse.json(
          {
            error: "Resend error",
            detail: (result as any).error,
            hint: "Most common: FROM domain not verified in Resend. Try using onboarding@resend.dev as FROM first.",
          },
          { status: 502 },
        );
      }

      return NextResponse.json(
        { error: "Email service error. Please try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { ok: true, id: (result as any)?.data?.id ?? null },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("[/api/contact] Exception:", err);

    // dev mode: ส่งรายละเอียดกลับไปดูใน Postman
    if (!isProd()) {
      return NextResponse.json(
        { error: "Server exception", detail: String(err?.message ?? err) },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 },
    );
  }
}
