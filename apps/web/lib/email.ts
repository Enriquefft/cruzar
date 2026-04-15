import { Resend } from "resend";
import { renderMagicLink } from "./email/templates/magic-link";
import { env } from "./env";

// Magic-link expiry mirrors the default on the `magic-link` plugin (5 minutes).
// If the plugin's `expiresIn` changes, update this constant in the same PR.
const MAGIC_LINK_EXPIRES_IN_MINUTES = 5;

let cached: Resend | undefined;

function client(): Resend {
  if (!cached) cached = new Resend(env().RESEND_API_KEY);
  return cached;
}

export async function sendMagicLinkEmail(params: { email: string; url: string }): Promise<void> {
  const { subject, text, html } = renderMagicLink({
    url: params.url,
    expiresInMinutes: MAGIC_LINK_EXPIRES_IN_MINUTES,
  });

  const { data, error } = await client().emails.send({
    from: env().RESEND_FROM_EMAIL,
    to: params.email,
    subject,
    html,
    text,
  });
  if (error) throw new Error(`Resend failed: ${error.message}`);
  if (!data) throw new Error("Resend returned no data");
}
