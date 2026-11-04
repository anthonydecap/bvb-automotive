import { NextResponse } from "next/server";

import { fieldLabels, subjects } from "@/lib/contact";

/**
 * Contact form endpoint. Sends the message by e-mail through Resend
 * (RESEND_API_KEY). Without a key it answers 503, and the form shows the
 * phone number, WhatsApp and e-mail address instead.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const value = (key: string, max = 300) => String(body[key] ?? "").trim().slice(0, max);

  // Bots fill in the hidden field.
  if (value("website")) return NextResponse.json({ ok: true });

  const fields = Object.fromEntries(
    Object.keys(fieldLabels).map((key) => [key, value(key, key === "bericht" ? 5000 : 300)]),
  );
  if (!fields.naam || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) || !fields.bericht) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (!(subjects as readonly string[]).includes(fields.onderwerp)) fields.onderwerp = "Andere";

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const text = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => (k === "bericht" ? `\n${v}\n` : `${fieldLabels[k]}: ${v}`))
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_EMAIL_FROM ?? "BVB Automotive <website@bvbautomotive.be>",
      to: (process.env.CONTACT_EMAIL_TO ?? "info@bvbautomotive.be").split(","),
      reply_to: fields.email,
      subject: `${fields.onderwerp}${fields.wagen ? `: ${fields.wagen}` : ""} (${fields.naam})`,
      text,
    }),
  });

  if (!res.ok) {
    console.error("Contact form: Resend error", res.status, await res.text());
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
