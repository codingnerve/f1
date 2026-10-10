"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 fill-current">
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 fill-current">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zm7 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.15-.02-2.64-1.6-2.64-1.62 0-1.86 1.26-1.86 2.56v4.92H10z" />
    </svg>
  );
}

/**
 * Share the canonical page URL. Uses the production domain (never localhost) so shared
 * links always point at way2tickets.com.
 */
export function ShareControls({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* dismissed */
      }
    } else {
      await copy();
    }
  };

  const linkClass =
    "inline-flex size-8 items-center justify-center rounded-xs border border-white/20 text-white/80 transition-colors hover:border-white hover:text-white";

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs font-medium text-white/60">Share</span>
      <button type="button" onClick={nativeShare} className={`${linkClass} sm:hidden`} aria-label="Share this page">
        <Share2 aria-hidden="true" className="size-3.5" />
      </button>
      <a
        href={`https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${linkClass} hidden sm:inline-flex`}
        aria-label="Share on X (opens in a new tab)"
      >
        <XIcon />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${linkClass} hidden sm:inline-flex`}
        aria-label="Share on Facebook (opens in a new tab)"
      >
        <FacebookIcon />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${linkClass} hidden sm:inline-flex`}
        aria-label="Share on LinkedIn (opens in a new tab)"
      >
        <LinkedInIcon />
      </a>
      <button type="button" onClick={copy} className={linkClass} aria-label={copied ? "Link copied" : "Copy link"}>
        {copied ? <Check aria-hidden="true" className="size-3.5" /> : <Link2 aria-hidden="true" className="size-3.5" />}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
