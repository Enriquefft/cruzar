import { createAuthClient } from "better-auth/client";
import { magicLinkClient } from "better-auth/client/plugins";

function resolveBaseURL(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export const authClient = createAuthClient({
  baseURL: resolveBaseURL(),
  plugins: [magicLinkClient()],
});

export async function signInWithMagicLink(email: string): Promise<void> {
  await authClient.signIn.magicLink({
    email,
    callbackURL: "/profile",
    newUserCallbackURL: "/onboarding",
  });
}

export async function signInWithGoogle(): Promise<void> {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/profile",
    newUserCallbackURL: "/onboarding",
  });
}

export async function signOut(): Promise<void> {
  await authClient.signOut();
}
