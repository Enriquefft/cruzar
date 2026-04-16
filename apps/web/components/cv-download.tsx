"use client";

interface CvDownloadProps {
  downloadUrl: string;
}

export function CvDownload({ downloadUrl }: CvDownloadProps) {
  return (
    <a
      href={downloadUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[color:var(--brand-hairline)] bg-[color:var(--brand-card)] px-5 py-3 text-sm font-medium text-[color:var(--brand-ink)] transition-colors hover:border-[color:var(--brand-hairline-strong)] hover:bg-[color:var(--brand-paper-deep)] active:bg-[color:var(--brand-paper-deep)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Descargar CV
    </a>
  );
}
