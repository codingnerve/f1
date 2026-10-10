/** Attribution for a licensed image. Required for every photograph shipped in /public/images. */
export interface ImageCredit {
  /** Original file title at the source, e.g. "File:COTA turn 1.jpg". */
  title: string;
  author: string;
  /** Short licence name, e.g. "CC BY-SA 4.0", "CC0", "Public domain". */
  license: string;
  licenseUrl?: string;
  /** Human-readable page describing the source file (e.g. the Wikimedia Commons file page). */
  sourceUrl: string;
}

export interface ImageAsset {
  /** Path under /public, e.g. "/images/events/united-states/hero.jpg". */
  src: string;
  /** Actual pixel dimensions of the saved file (verified, not assumed). */
  width: number;
  height: number;
  /** Descriptive alt text: what is actually visible in the photo. */
  alt: string;
  /** Optional CSS object-position for responsive crops, e.g. "50% 40%". */
  focal?: string;
  credit: ImageCredit;
}
