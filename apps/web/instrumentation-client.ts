import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

if (key) {
  posthog.init(key, {
    api_host: host,
    defaults: "2026-01-30",
    capture_exceptions: true,
    session_recording: {
      maskAllInputs: true,
    },
    person_profiles: "identified_only",
  });
}
