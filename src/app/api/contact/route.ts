import { NextResponse } from "next/server";
import { Resend } from "resend";
import type { ContactPayload } from "@/types/contact";
import type { CreateEmailOptions, CreateEmailResponse } from "resend";

/* ===============================
   Utils
================================ */

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

function asLineBreakHtml(s: string) {
  return escapeHtml(s).replaceAll("\n", "<br/>");
}

function makePreview(s: string, max = 220) {
  const trimmed = s.trim();
  if (trimmed.length <= max) return asLineBreakHtml(trimmed);
  return asLineBreakHtml(trimmed.slice(0, max)) + "…";
}

type Env = {
  apiKey: string;
  to: string;
  from: string;
};

function getEnv(): Env | { error: string; status: number } {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "Worapon.dev <onboarding@resend.dev>";

  if (!apiKey) return { error: "Missing RESEND_API_KEY", status: 500 };
  if (!to) return { error: "Missing CONTACT_TO_EMAIL", status: 500 };

  return { apiKey, to, from };
}

function validate(body: ContactPayload) {
  // --- Honeypot ---
  if (body.website && body.website.trim() !== "") {
    return { ok: true as const, honeypot: true as const };
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return {
      ok: false as const,
      status: 400,
      error: "Please fill in name, email, and message.",
    };
  }

  if (!isEmail(email)) {
    return { ok: false as const, status: 400, error: "Invalid email." };
  }

  if (name.length > 80) {
    return { ok: false as const, status: 400, error: "Name is too long." };
  }

  if (message.length > 4000) {
    return { ok: false as const, status: 400, error: "Message is too long." };
  }

  return {
    ok: true as const,
    honeypot: false as const,
    data: { name, email, message },
  };
}

async function sendEmail(resend: Resend, payload: CreateEmailOptions) {
  const result: CreateEmailResponse = await resend.emails.send(payload);
  return result;
}

/* ===============================
   POST /api/contact
================================ */

export async function POST(req: Request) {
  // --- Parse JSON ---
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch (e) {
    console.error("[/api/contact] Invalid JSON:", e);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // --- Validate ---
  const v = validate(body);
  if (v.ok && v.honeypot) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
  if (!v.ok) {
    return NextResponse.json({ error: v.error }, { status: v.status });
  }

  const { name, email, message } = v.data;

  // --- ENV ---
  const env = getEnv();
  if ("error" in env) {
    return NextResponse.json({ error: env.error }, { status: env.status });
  }

  const { apiKey, to, from } = env;

  // ✅ สร้าง Resend ตอน runtime เท่านั้น (กัน build crash)
  const resend = new Resend(apiKey);

  try {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = asLineBreakHtml(message);

    // 1) Owner email
    const ownerSubject = `New Contact — ${name}`;

    const ownerPayload: CreateEmailOptions = {
      from,
      to,
      subject: ownerSubject,
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
      replyTo: email,
    };

    const ownerResult = await sendEmail(resend, ownerPayload);

    if (ownerResult.error) {
      console.error("[Resend] owner send error:", ownerResult.error, {
        from,
        to,
      });

      if (!isProd()) {
        return NextResponse.json(
          {
            error: "Resend error",
            detail: ownerResult.error,
            hint: "Most common: FROM domain not verified. Try onboarding@resend.dev",
          },
          { status: 502 },
        );
      }

      return NextResponse.json(
        { error: "Email service error. Please try again later." },
        { status: 502 },
      );
    }

    // 2) Auto-reply to customer
    const customerSubject = "Message received — Worapon.dev";

    const customerPayload: CreateEmailOptions = {
      from,
      to: email,
      subject: customerSubject,
      html: `
        <div style="background:#ffffff;">
          <div style="
            max-width:600px;
            margin:0 auto;
            padding:0 16px 24px;
            font-family: ui-sans-serif, system-ui;
            line-height:1.7;
          ">
            <img
              src="https://worapon.dev/email/contact-header.png"
              alt="Worapon.dev"
              width="600"
              style="display:block;width:100%;max-width:600px;height:auto;border:0;margin:0 auto 20px;"
            />

            <h2 style="margin: 0 0 12px">
              Message sent successfully. Your information has been received.
            </h2>

            <p style="margin: 0 0 10px">
              Hi ${safeName}, thanks for reaching out.
              I’ve received your message and will get back to you soon.
            </p>

            <div style="padding:12px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa">
              <p style="margin:0 0 6px;color:#6b7280;font-size:12px">
                Your message preview:
              </p>
              <div style="font-size:14px">
                ${makePreview(message, 220)}
              </div>
            </div>

            <p style="margin:12px 0 0">
              <b>Expected response time:</b> within 24–48 hours.
            </p>

            <p style="margin:12px 0 0;color:#6b7280;font-size:12px">
              If you didn’t send this message, you can ignore this email.
            </p>

            <hr style="margin:16px 0;border:0;border-top:1px solid #e5e7eb" />

            <p style="margin:0;font-size:13px">
              — Thank you,<br/>
              Worapon.dev
            </p>
          </div>
        </div>
      `,
    };

    const customerResult = await sendEmail(resend, customerPayload);
    if (customerResult.error) {
      console.warn("[Resend] auto-reply failed:", customerResult.error, {
        to: email,
      });
    }

    return NextResponse.json(
      { ok: true, id: ownerResult.data?.id ?? null },
      { status: 200 },
    );
  } catch (err) {
    console.error("[/api/contact] Exception:", err);

    if (!isProd()) {
      return NextResponse.json(
        {
          error: "Server exception",
          detail: err instanceof Error ? err.message : String(err),
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 },
    );
  }
}
