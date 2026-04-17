import type { Instrumentation } from "next";
import type { PostHog } from "posthog-node";

let client: PostHog | null = null;

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  const { PostHog: PostHogCtor } = await import("posthog-node");
  client = new PostHogCtor(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });
}

export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  if (!client) return;
  const error = err instanceof Error ? err : new Error(String(err));
  client.captureException(error, undefined, {
    path: request.path,
    method: request.method,
    routerKind: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
  });
  await client.flush();
};
