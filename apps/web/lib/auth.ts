import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { db } from "@/db/client";
import { account, session, user, verification } from "@/db/schema";
import { sendMagicLinkEmail } from "./email";
import { env } from "./env";

const e = env();
const googleSocial =
  typeof e.GOOGLE_CLIENT_ID === "string" && typeof e.GOOGLE_CLIENT_SECRET === "string"
    ? {
        socialProviders: {
          google: {
            clientId: e.GOOGLE_CLIENT_ID,
            clientSecret: e.GOOGLE_CLIENT_SECRET,
          },
        },
      }
    : {};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  secret: e.BETTER_AUTH_SECRET,
  baseURL: e.BETTER_AUTH_URL,
  emailAndPassword: { enabled: false },
  ...googleSocial,
  plugins: [
    magicLink({
      rateLimit: { window: 60 * 60, max: 5 },
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail({ email, url });
      },
    }),
  ],
  rateLimit: { enabled: true },
});

export type Session = typeof auth.$Infer.Session;
