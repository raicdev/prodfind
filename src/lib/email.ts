import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  from = "test@test.rai.bio",
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  if (!from) {
    throw new Error("Missing sender email address (RESEND_FROM_EMAIL)");
  }
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY environment variable");
  }
  return await resend.emails.send({
    from,
    to,
    subject,
    html,
  });
}
